const mongoose  = require('mongoose')
const dburl=process.env.DATABASE

mongoose.connect(dburl).then((res)=>{
    
    console.log("connected")
}).catch((err)=>{
    console.log(`error:${err}`)
});

const UserDetailinformation= new mongoose.Schema({
    name:String,
    contactno:Number,
    email:String,
    password:String


});
const UserModelinformation=mongoose.model('UserModelinformation',UserDetailinformation);
module.exports=UserModelinformation;
