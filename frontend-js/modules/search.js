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

        //alert(JSON.stringify(response.data))
        this.renderResultsHTML(response.data)
      }).catch(()=>{
          alert('failed')
      })
  }
  renderResultsHTML(posts){
      //alert('renderResultsHTML')
    if(posts.length){
        
        this.resultsArea.innerHTML=`<div class="list-group shadow-sm">
            <div class="list-group-item active"><strong>Search Results</strong> (4 items found)</div>
            
           ${posts.map(post=>{
               
               let postDate=new Date(post.createdDate)
               return `<a href="#" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="${post.author.avatar}"> <strong>${post.title}</strong>
              <span class="text-muted small">by ${post.author.username} on ${postDate.getMonth()+1}/${postDate.getDate()}/${postDate.getFullYear()}</span>
            </a>`
           }).join('')}
            
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
      this.resultsArea.classList.add("live-search-results--visible")
  }
  hideResultsArea(){
      this.resultsArea.classList.remove("live-search-results--visible")
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
        <div class="live-search-results">  </div>
      </div>
    </div>
</div>`)}
}