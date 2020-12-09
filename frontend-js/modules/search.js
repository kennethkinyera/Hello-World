import axios from 'axios'

export default class Search{

    //select DOM elements and useful data
constructor(){

  this.injectHTML()
  this.headerSelectIcon=document.querySelector(".header-search-icon")
  this.overlay=document.querySelector(".search-overlay")
  this.closeIcon=document.querySelector(".close-live-search")
  this.inputField=document.querySelector("#live-search-field")
  this.resultsArea=document.querySelector(".live-search-results")
  this.loaderIcon=document.querySelector(".circle-loader")
  this.typingwaittimer
  this.previousValue=""
  this.events()
  
}

  // events
events(){
    this.inputField.addEventListener("keyup",()=>this.keyPressHandler())
    this.closeIcon.addEventListener("click",()=> this.closeOverlay())
    this.headerSelectIcon.addEventListener("click",(e)=>{
        e.preventDefault()
        this.openOverlay()
    })
}
  //methods
  keyPressHandler(){

      let value=this.inputField.value

      if(value==""){

        clearTimeout(this.typingwaittimer)
        this.hideLoaderIcon()
        this.hideResultsArea()
      }
      if(value !="" && value !=this.previousValue){

          clearTimeout(this.typingwaittimer)
          this.showLoaderIcon()
          this.hideResultsArea()
          this.typingwaittimer=setTimeout(()=>this.sendRequest(),3000)
      }
      this.previousValue=value
  }
  sendRequest(){
      axios.post('/search',{searchTerm:this.inputField.value}).then(response=>{

        //console.log(response.data)
        //console.log('response',response)
        console.log('here',"here")
        this.renderResultsHTML(response.data)
      }).catch(()=>{
          alert('failed')
          console.log('failed',"failed")
      })
  }
  renderResultsHTML(posts){
    if(posts.length){
        this.resultsArea.innerHTML=`<div class="list-group shadow-sm">
            <div class="list-group-item active"><strong>Search Results</strong> (4 items found)</div>

            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #1</strong>
              <span class="text-muted small">by barksalot on 0/14/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #2</strong>
              <span class="text-muted small">by brad on 0/12/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #3</strong>
              <span class="text-muted small">by barksalot on 0/14/2019</span>
            </a>
            <a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #4</strong>
              <span class="text-muted small">by brad on 0/12/2019</span>
            </a>
          </div>`
}
else{
       this.resultsArea.innerHTML=`<p class="alert alert-danger text-center shadow-sm">Sorry,we couldn't find any results</p>`
}
this.hideLoaderIcon()
this.showResultsArea()
  }
  hideLoaderIcon(){
      this.loaderIcon.classList.remove("circle-loader--visible")
  }
  showLoaderIcon(){
      this.loaderIcon.classList.add("circle-loader--visible")
  }
  showResultsArea(){
      this.loaderIcon.classList.add("live-search-results--visible")
  }
  hideResultsArea(){
      this.loaderIcon.classList.remove("live-search-results--visible")
  }
  openOverlay(){
    this.overlay.classList.add("search-overlay--visible")
    setTimeout(()=>this.inputField.focus(),50)
  }
  closeOverlay(){
    this.overlay.classList.remove("search-overlay--visible")
  }
injectHTML(){
    document.body.insertAdjacentHTML('beforeend',
`<div class="search-overlay ">
    <div class="search-overlay-top shadow-sm">
      <div class="container container--narrow">
        <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
        <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
        <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
      </div>
    </div>

    <div class="search-overlay-bottom">
      <div class="container container--narrow py-3">
        <div class="circle-loader"></div>
        <div class="live-search-results "></div>
      </div>
    </div>
</div>`)}
}