const express =require('express')
const app=express()
const twilio = require('twilio')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const connectDB=require('./config/db')
const authRoutes=require('./routes/auth')
const postRoutes=require('./routes/post')
const commentRoutes=require('./routes/comment')
var cors = require('cors')

if(process.env.NODDE_ENV==='production')
{
  app.use(express.static('client/build'))
}
app.get('*',(req, res) =>{
  res.sendFile(path.resolve(__dirname,'client','build','index.html'));
});
connectDB()
//middleware
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)
app.use('/api/comment',commentRoutes)



const config = {
    accountSid : 'ACedc07b7fa27e3a8a6ae6995b687e9c84',
    authToken : '31c139262f3e354c5507b7b196c5ee9e'
  }

let client = new twilio(
  config.accountSid, 
  config.authToken
)



app.get('/sms', (req, res) => {
  
   //_GET Variables
   const { recipient, textmessage } = req.query;


    const twiml = new MessagingResponse();
    
    twiml.message('The Robots are coming! Head for the hills!');
    client.messages.create({
      to: '(+216)29897261',
      from: '+15074188036',
      body: textmessage
    }, (err, res) => {
    
      if (err) 
        console.log(`An error has ocurred: ${err}`)
      else 
      console.log(`¡SMS Success! Date:${res.dateCreated} Id: ${res.sid}`)
      
    })
    
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });
  








const port=5000
app.listen(port,()=>console.log(`server runing en port ${port}`))