export default class RegistrationForm{
    constructor(){
        this.allFields=document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username=document.querySelector("#username-register")
        this.username.previousValue=""
        this.events()
    }

    //events

    events(){
        this.username.addEventListener("keyup",()=>{
            this.isDifferent(this.username,this.usernameHandler)
        })
    }
    //methods
    isDifferent(el,handler){
         if(el.previousValue!=el.value){
            handler.call(this)
         }
         el.previousValue=el.value
    }
    usernameHandler(){
        this.usernameImmediately()
        clearTimeout(this.username.timer)
        this.username.timer =setTimeout(()=>this.usernameAfterDelay(),3000)
    }
    usernameImmediately(){
        console.log("usernameImmediately just ran")
    }
    usernameAfterDelay(){
        alert("usernameAfterDelay")
    }
    insertValidationElements(){
        this.allFields.forEach(function(el){
            el.insertAdjacentHTML('afterend','<div class="alert alert-danger small liveValidateMessage liveValidateMessage"></div>')
        })
    }

}