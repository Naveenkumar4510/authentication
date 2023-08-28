//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

// const uname=process.env.USERNAME;
// const pass=process.env.PASSWORD;

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));


mongoose.connect("mongodb+srv://naveenkuma1045:naveen4510@cluster0.35fqhte.mongodb.net/SecretsDB", { useNewUrlParser: true });

//mongodb+srv://" + uname + ":" + pass + "@cluster0.57qzj.mongodb.net/todolistDB

//mongodb+srv://naveenkuma1045:<password>@cluster0.35fqhte.mongodb.net/?retryWrites=true&w=majority

const userSchema=mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);




app.get('/',function(req,res)
{
res.render("home");
})

app.get('/login',function(req,res)
{
res.render("login");
})

app.get('/register',function(req,res)
{
res.render("register");
})


app.post("/register",function(req,res)
{
const newUser=new User(

  {
    email:req.body.username,
    password:req.body.password
  });

newUser.save().then(()=>
{
  res.render("secrets");
})
.catch((err)=>
{
  console.log(err);
})

});


app.post("/login",function(req,res)
{
const username=req.body.username;
const password=req.body.password;


User.findOne({
  email:username
}).then((foundUser)=>
{
  if(foundUser)
  {
    if(foundUser.password===password)
    {
      res.render("secrets");
    }
  }
  
})
.catch((err)=>
{
  console.log(err);
})

});

// app.listen(3000,function()
// {
//   console.log("Server started on port 3000");
// })

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
 
// app.listen(port, function() {
//   console.log("Server started succesfully");
// });


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});