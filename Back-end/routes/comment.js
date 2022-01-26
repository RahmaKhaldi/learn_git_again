const express=require('express')
const User = require('../models/User')
const Comment = require('../models/Comment')
const isAuth = require('../middleware/isAuth')
const router=express.Router()
require('dotenv').config({path:'../config/.env'})

//test

router.get('/test',(req,res)=>{
res.send('test')
})
//@ url:/api/comment/addComment
//@ methode post
//@ req.body
router.post('/addComment/:idPost',isAuth,async(req,res)=>{
    const { content}=req.body
    const { idPost}=req.params
  
    try {   
       const comment=new Comment({
        content,userId:req.user.id,postId:idPost
       })
       await comment.save()
       res.status(200).send({msg:"comment added",comment})
    
    
  } catch (error) {
    res.status(500).send(error)

      
  }
    })


//@ url:/api/comment/allComments
//@ methode get
//@ req.headers
router.get('/allComment',async(req,res)=>{
  
 try {
   const comments=await Comment.find().populate('postId',"content")
  res.send(comments)
  
 } catch (error) {
  res.status(500).send(error)
 }
  })

module.exports=router
