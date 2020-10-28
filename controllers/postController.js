const Post=require('../models/Post')

exports.viewCreateScreen=function(req,res){
  res.send('create-post')
}

exports.viewSingle=function(req,res){
  res.send('single-post')
}

exports.create=function(req,res){

 let post=new Post(req.body,req.session.user._id)

 post.create().then(function(newId){
     req.flash ("success","New post successfully created")
     req.session.save(()=>{res.render(`post/${newId}`)})
 }).catch(function(errors){
      errors.forEach(error=>req.flash("errors",error))
      req.session.save(()=>res.redirect("/create-post"))
 })
}

exports.viewEditScreen = async function(req, res) {

  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId)
    if (post.isVisitorOwner) {
      res.render("edit-post", {post: post})
    } else {
      req.flash("errors", "You do not have permission to perform that action.")
      req.session.save(() => res.redirect("/"))
    }
  } catch {
    res.render("404")
  }
}

exports.edit=function(req,res){

  let post=new Post(req.body,req.visitorId,req.params.id)
  post.update().then((status)=>{
    //successful
    //validation errors
    if(status=="success"){
      req.flash("success","Post succeesfully updated")
      req.session.save(function(){
        res.redirect(`/post/${req.params.id}/edit`)
      })
    }else{
       post.errors.forEach(function(error){
       req.flash("errors",error)
       })
       req.session.save(function(){
       res.redirect(`/post/${req.params.id}/edit`)
       })
     }
  }).catch(()=>{
    //post with requsted id doesn't exist
    //or current user isn't owner of post
    res.flash("error","You do not have permissions to complete that action")
    req.session.save(function(){
      res.redirect("/")
    })
  })
}

exports.delete=function(req,res){
  
  Post.delete(req.params.id,req.visitorId).then(()=>{
      req.flash("success", "Post successfully deleted")
      req.session.save(()=>res.redirect(`/profile/${req.session.user.username}`))
  }).catch(()=>{
       req.flash("errors", "You do not have permission to delete this post")
       req.session.save(()=>res.redirect("/"))
  })
}