const userCollection=require("../db").db().collection("users")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const md5=require("md5")

let User=function(data,getAvatar){
  this.data=data
  this.errors=[]
  if(getAvatar==undefined){getAvatar=false}
  if(getAvatar){this.getAvatar()}
}

User.prototype.cleanUp=function(){

    if(typeof(this.data.username)!="string"){this.data.username=""}
    if(typeof(this.data.email)!="string"){this.data.email=""}
    if(typeof(this.data.password)!="string"){this.data.password=""}

    this.data={
        username:this.data.username.trim().toLowerCase(),
        email:this.data.email.trim().toLowerCase(),
        password:this.data.password
    }
}
User.prototype.validate=function(){

    return new Promise(async (resolve,reject)=>{

        if(this.data.username==""){this.errors.push("You must enter a username")}
        if(this.data.username=="" && !validator.isAlphanumeric(this.data.username)){this.errors.push("You must enter letters of numbers only for username ")}
        if(this.data.email==""){this.errors.push("You must enter a valid email")}
        if(!validator.isEmail(this.data.email)){this.errors.push("You must enter a valid email")}
        if(this.data.password.length>50){this.errors.push("You have entered a very long password")}
        if(this.data.password.length<5){this.errors.push("You have entered a very short password")}
        if(this.data.password==""){this.errors.push("You must enter a password")}
    

        try{
            let usernameExists=await userCollection.findOne({username:this.data.username})
        
        if(usernameExists && this.data.username.length>2 && validator.isAlphanumeric(this.data.username)){
            this.errors.push("This username is already taken")
            reject()
        }
          
        let emailExists=await userCollection.findOne({email:this.data.email})
        if(emailExists && this.data.email.length>2 && validator.isEmail(this.data.email)){
            this.errors.push("This email is already in use")
            reject()
        }
        resolve()
        }catch(error){
            console.log('Validate errors:',error)
        }
        
        
    })
}

User.prototype.login=function(){
    
   return new Promise(async (resolve,reject)=>{

    this.cleanUp()
    let password=this.data.password
    await userCollection.findOne({username:this.data.username}).then(function(attemptedUser){

        if(attemptedUser && bcrypt.compareSync(password,attemptedUser.password)){
            
            this.data=attemptedUser
            this.data.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
            //this.getAvatar()
            //yes
            resolve(this.data)
         }
        }).catch(function(error){
             //reject("Please try again",error)
             console.log("error",error)
             reject("Please try again")
      })  
    })
}
User.prototype.register=function(){
    return new Promise(async (resolve,reject)=>{

        try {
            this.cleanUp()
        await this.validate()
    
        if(!this.errors.length){
            let salt=bcrypt.genSaltSync(10)
            this.data.password=bcrypt.hashSync(this.data.password,salt)
            await userCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        }else{
            reject(this.errors)
        }
            
        } catch (error) {
            reject(error)
        }
        
    })
}
User.prototype.getAvatar=function(){
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}
User.findByUsername=function(username){

  return new Promise(async (resolve,reject)=>{
      if(typeof(username)!="string"){
          reject()
          return
      }
      await userCollection.findOne({username:username}).then(function(userDoc){
           if(userDoc){
               userDoc=new User(userDoc,true)
               userDoc={
                   _id:userDoc.data._id,
                   username:userDoc.data.username,
                   avatar:userDoc.avatar
               }
             resolve(userDoc)
           }else{
               reject()
           }
      }).catch(function(){
          
    })
  })
}
module.exports=User