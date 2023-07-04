const express =require('express')
const jwt=require('jsonwebtoken')
var parseUrl = require('body-parser');
const cookies=require("cookie-parser")

let encodeUrl = parseUrl.urlencoded({ extended: false });
require("dotenv").config();
const bcrypt =require('bcrypt')
const app=express()
app.use(cookies());
const port =3000
const usermodel=require('./db');
const UserModelinformation = require('./db');
const path = require('path');

// app.set('view engine', 'ejs');
app.use(express.static('view'))


app.post('/auth/login',encodeUrl,async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    console.log(password,email);
    
    const existinguser= await UserModelinformation.findOne({email})
    if(!existinguser){
        res.json({"msg":"usernotfound"})
    }
     
       
    const matchpassword = await bcrypt.compare(password,existinguser.password);
        
          
        
    const token =await jwt.sign({email:existinguser.email,id:existinguser._id},process.env.JWT_SECRET,{expiresIn:'30d'});
    console.log("token part "+token)
    res.cookie("jwt",token,{ httpOnly:true, });
    if(matchpassword){
        return res.redirect('/profile')
    }
    else{
        res.send.json({"msg":"invalid password"})
    }

       
       


    
})
function verifytoken(req,res,next){
    console.log(`this is  cookie token ${req.cookies.jwt}`);
    const accesstoken =req.cookies.jwt;
    
    if(accesstoken){
        
        jwt.verify(accesstoken,process.env.JWT_SECRET,(err,valid)=>{
            if(err){
                res.status(403).send({result:"please enter valid token"})
            }
            else{
                next();
            }
        })
    }
    else{
        res.status(404).send({result:"please enter token "})
    }
   console.log("middleware called ")
    
}
app.post('/auth/register',encodeUrl,async (req,res)=>{

   const hashedpassword=await bcrypt.hash(req.body.password,10);

   const data =new UserModelinformation({
    name:req.body.name,
    contactno:req.body.contactno,
    email:req.body.email,
    password:hashedpassword
   });
   const information = await data.save();
   
   
  res.redirect('/');

   
});
//profile page

app.get('/profile',verifytoken,async (req,res)=>{
    
    res.render(path.join(__dirname+'/view/profile.ejs'));
});

//login page

app.get('/',async (req,res)=>{
   
    res.render(path.join(__dirname+'/view/login.ejs'));
    }) 

//register page 

app.get('/register',async (req,res)=>{
res.render(path.join(__dirname+'/view/register.ejs'));
}) 
app.get('/logout', async (req,res)=>{
    res.clearCookie("jwt",{path:'/login'});
    res.render(path.join(__dirname+'/view/login.ejs'))
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
});

