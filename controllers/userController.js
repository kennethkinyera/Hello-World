let User=require("../models/User")

exports.mustBeLoggedIn=function(req,res,next){
  if(req.session.user){
      next()
  }else{
       req.flash("errors","You must be logged in to complete this action")
       req.session.save(function(){
           res.redirect('/')
       })
  }
}
exports.login=function(req,res){

    let user=new User(req.body)
    user.login().then(function(result){

    req.session.user={avatarColor:user.avatar,username:user.data.username,_id:result._id}
    //req.session.user={avatarColor:user.avatar,username:this.data.username,_id:user.data._id}
    req.session.save(function(){
        res.redirect('/')
    })
    }).catch(function(error){
        console.log('zzzz',error)
        
        req.flash('errors',error)
        req.session.save(function(){
            res.redirect('/')
        })
    })
}

exports.logout=function(req,res){
   req.session.destroy(function(){
       res.redirect('/')
   })
}

exports.register=function(req,res){
    
    let user=new User(req.body)

    user.register().then(()=>{

        req.session.user ={username:user.data.username,avatar:user.data.avatar,_id:user.data._id}
        req.session.save(function(){
            res.redirect('/')
        })

    }).catch((regErrors)=>{

        regErrors.forEach(function(error) {
            req.flash("regErrors",error)
        })
        req.session.save(function(){
               res.redirect('/')
       })
    })
}

exports.home=function(req,res){
    
    if(req.session.user){
        res.render ('home-dashboard')
    }
    else{
        res.render('home-guest',{resErrors:req.flash('resErrors')})
    }
}

exports.ifUserExists=function(req,res,next){
    user.findByUsername(req.params.username).then(function(userDocument){
        req.profileUser=userDocument
        next()
    }).catch(function(){
        res.render('404')
    })
}

exports.profilePostsScreen=function(req,res,){
    
    //ask our post model for posts by author id
    Post.findByAuthorId(req.profileUser._id).then(function(posts){
        res.render('profile',{
            posts:posts,
            profileUsername:req.profileUser.username,
            profileAvatar:req.profileUser.avatar
        })
    }).catch(function(){

    })
    
}

