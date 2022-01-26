const mongoose=require('mongoose')
const schema=mongoose.Schema

const postSchema=new schema({
    content:{
        type:String,
        required:true
    },
  
    postId:{
        type:schema.Types.ObjectId,
        ref:'Post'
        
    },
    userId:{
        type:schema.Types.ObjectId,
        ref:'User'
        
    },
    
   

})

module.exports=mongoose.model('Comment',postSchema)