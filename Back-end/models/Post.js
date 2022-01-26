const mongoose=require('mongoose')
const schema=mongoose.Schema

const postSchema=new schema({
    
    content:{
        type:String
    },
   
    etat:{
        type:Boolean
        
    },
    price:{
        type:String
        
    },
    userId:{
        type:schema.Types.ObjectId,
        ref:'User'
        
    }
    
   

})

module.exports=mongoose.model('Post',postSchema)