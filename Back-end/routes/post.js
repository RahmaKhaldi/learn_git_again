const express=require('express')
const User = require('../models/User')
const Post = require('../models/Post')
const isAuth = require('../middleware/isAuth')
const router=express.Router()
require('dotenv').config({path:'../config/.env'})

//test

router.get('/test',(req,res)=>{
res.send('test')
})


//@ url:api/post/allPosts
//@ methode get
//@ req.headers
router.get('/allPost',async(req,res)=>{
  try {
    const posts=await Post.find().populate('userId',["name","email","phone","imageURL"])
    res.send({"posts":posts})
   
  } catch (error) {
   res.status(500).send(error)
     
  }
   })
 
//@ url:api/post/addPost
//@ methode post
//@ req.body
router.post('/addPost',isAuth,async(req,res)=>{
    const { content}=req.body
   
    try {   
       const post=new Post({
        content,etat:false,userId:req.user.id
       })
       await post.save()
       res.status(200).send({msg:"post added",post})
    
    
  } catch (error) {
    res.status(500).send(error)
      
  }
    })

//@ url:api/post/editEtat
//@ methode post
//@ req.body
router.put('/editEtat/:id',async(req,res)=>{
  const{id}=req.params
 
  try {   

    
    const post=await Post.findByIdAndUpdate(id,{$set:{_id:id,etat:true}})
     res.status(200).send({msg:"post added",post})
  
  
} catch (error) {
  res.status(500).send(error)
    
}
  })



//@ url:api/post/allPostsById
//@ methode get
//@ req.headers
router.get('/allPostById',async(req,res)=>{
 try {
   const posts=await Post.populate('userId',["name","email"]).select("-_id")
   res.send(posts)
  
 } catch (error) {
  res.status(500).send(error)
    
 }
  })

module.exports=router