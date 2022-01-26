const express=require('express')
const User = require('../models/User')
const router=express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config({path:'../config/.env'})
const { validator,registerRules ,loginRules}= require('../middleware/validator');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/uploadImage');
const { reset } = require('nodemon');
const { request } = require('express');

//test

router.get('/test',(req,res)=>{
res.send('test')
})
//@ url:api/auth/signup
//@ methode post
//@ req.body
router.post('/signup',[registerRules,validator],async(req,res)=>{
    const {name,email,password,phone,fonction,role,pays}=req.body
   let imageURL=""
    if(req.file){
      imageURL=req.file.filename
    }
    try {
      //check user exist
      const founduser=await User.findOne({email})
      if(founduser)
      {
        return res.status(400).send({errors:[{msg:"email already exists!"}]})        
      }
          const user=new User({
            name,email,password,phone,fonction,role,pays,imageURL
        })
        //hash password
      const salt=10
      const hashpassword=await bcrypt.hash(password,salt)
      user.password=hashpassword  
  
        await user.save()
        //token
        const payload={
          id:user._id
        }
        var token = jwt.sign(payload, process.env.mySecrete,{expiresIn:'3d'});
        res.send({msg:"user added",user,token})
    
  } catch (error) {
    res.status(500).send(error)
    
      
  }
    })

    //@ url:api/auth/signin
//@ methode post
//@ req.body
router.post('/signin',[loginRules,validator],async(req,res)=>{
  const {email,password}=req.body
  try {
    //check user exist
    const user=await User.findOne({email})
    if(!user)
    {
      return res.status(400).send({errors:[{msg:"bad credentials !"}]})        
    }
      
      //chek password
    const salt=10
    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch)
    {
      return res.status(400).send({errors:[{msg:"bad credentials !"}]})        
    } 

      //token
      const payload={
        id:user._id
      }
      var token = jwt.sign(payload, process.env.mySecrete,{expiresIn:'3d'});
      res.send({msg:"Signin",user,token})
      
  
} catch (error) {
  res.status(500).send({errors:[{msg:"bad credentials !"}]})
  
    
}
  })

//@ url:api/auth/current
//@ methode get
//@ req.headers
router.get('/current',isAuth,async(req,res)=>{
 try {
   const user=await User.findById(req.user.id)
   res.send(user)
  
 } catch (error) {
  res.status(500).send({errors:[{msg:"Error Server!"}]})
  
    
 }
  })

  
//@ url:api/auth/getUserById/:id
//@ methode get
//@ req.headers
router.get('/getUserById/:id',async(req,res)=>{
  const{id}=req.params
  try {
    const userI=await User.findById(id)
    res.send(userI)
  } catch (error) {
   res.status(500).send({errors:[{msg:"Error Server!"}]})
     
  }
   })

//@ url:api/auth/updateUser
//@ methode get
//@ req.headers

  router.put('/updateUser/:UserId', upload.single("myImage"), async(req,res)=>{
    const {UserId}=req.params
    let imageURL=req.body.imageURL
    if(req.file){
      imageURL=req.file.filename
    }
    try {
        const user= await User.findByIdAndUpdate(UserId,{$set:{...req.body,imageURL:imageURL}})
        res.status(200).send({msg:'user updated',user:user})
    } catch (error) {
        res.status(500).send({errors:[{msg:"error !"}]})
    }
  })

module.exports=router