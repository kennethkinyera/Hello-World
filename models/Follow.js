const followsCollection = require('../db').db().collection("follows")
const usersCollection = require('../db').db().collection("users")
const ObjectID=require('mongodb').ObjectID
const User=require("./User")

let Follow = function(followedUsername, authorId) {

this.followedUsername=followedUsername
this.authorId=authorId
this.errors=[]

}

Follow.prototype.cleanUp=function(){

    if(typeof(this.followedUsername)!="string"){this.followedUsername=""}
}

Follow.prototype.validate=async function(action){

    let followedAccount=await usersCollection.findOne({username:this.followedUsername})
    if(followedAccount){
       this.followedId=followedAccount._id
    }else{
        this.errors.push("You cannot follow a user that doesnot exist")   
     }
     let doesFollowAlreadyExists=followsCollection.findOne({followedId:this.followedId,authorId:new ObjectID(this.authorId)})

     if(action=="create"){

        if(doesFollowAlreadyExists==true){this.errors.push("You are already following this user")}
     }
     if(action=="delete"){

        if(doesFollowAlreadyExists==false){this.errors.push("You are not following this user")}
     }
     
 
        if(this.followedId.equals(this.authorId)){this.errors.push("You cannot follow yourself")}
     
}

Follow.prototype.create=function(){

    return new Promise(async(resolve,reject)=>{
        this.cleanUp()
        await this.validate("create")

        if(!this.errors.length){

            await followsCollection.insertOne ({followedId:this.followedId,authorId:new ObjectID(this.authorId)})
            resolve()
        }else{

            reject(this.errors)
        }
    })
}

Follow.isVisitorFollowing=async function(followedId, visitorId){
   let followDoc= await followsCollection.findOne({followedId:followedId,authorId:new ObjectID(visitorId)})
   if(followDoc){

    return true
   }else{
       return false
   }
}

Follow.prototype.delete=function(){

    return new Promise(async(resolve,reject)=>{
        this.cleanUp()
        await this.validate("delete")

        if(!this.errors.length){

            await followsCollection.deleteOne ({followedId:this.followedId,authorId:new ObjectID(this.authorId)})
            resolve()
        }else{

            reject(this.errors)
        }
    })
}
Follow.getFollowingById=function(id){

    return new Promise(async(resolve,reject)=>{

        try{ 
            let followers=await followsCollection.aggregate([
            {$match:{authorId:id}},
            {$lookup:{from:"users",localField:"followedId",foreignField:"_id",as:"userDoc"}},
            {$project:{
                username:{$arrayElemAt:["$userDoc.username",0]},
                email:{$arrayElemAt:["$userDoc.email",0]}
            }}
        ]).toArray()

          followers=followers.map(function(follower){
             //create a user
             let user=new User(follower,true)
             return {username:follower.username,avatar:user.avatar}
          })
          
          console.log("followers",followers)
          resolve(followers)

    }catch(error){
        console.log("rejected",error)
        reject()
    }
       
    })
}

Follow.getFollowersById=function(id){

    return new Promise(async(resolve,reject)=>{

        try{ 
            let followers=await followsCollection.aggregate([
            {$match:{followedId:id}},
            {$lookup:{from:"users",localField:"authorId",foreignField:"_id",as:"userDoc"}},
            {$project:{
                username:{$arrayElemAt:["$userDoc.username",0]},
                email:{$arrayElemAt:["$userDoc.email",0]}
            }}
        ]).toArray()
//gambling here
console.log("followers",followers)
          followers=followers.map(function(follower){
             //create a user
             let user=new User(follower,true)
             return {username:follower.username,avatar:user.avatar}
          })
          
          console.log("followers",followers)
          resolve(followers)
    }catch(error){
        console.log("rejected",error)
        reject()
    }
       
    })
}
Follow.countFollowersById=function(id){
 return new Promise(async (resolve,reject)=>{
     try{

        let followerCount=await followsCollection.countDocuments({followedId: id})
        resolve(followerCount)
     }catch{
       reject()
     }
    
 })
}

Follow.countFollowingById=function(id){
 return new Promise(async (resolve,reject)=>{
     try{

        let followingCount=await followsCollection.countDocuments({authorId: id})
        resolve(followingCount)
     }catch{
        reject()
     }
    
 })
}
module.exports = Follow