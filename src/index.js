const express = require("express");
const path =require('path');
const bcrypt = require("bcrypt");

// importing model that is created in config.js
const collection = require("./config");
const { name } = require("ejs");

const app = express();


// converting data to json format 
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');

app.get("/", (req , res)=>{
    res.render("login");
});

app.get("/signup", (req , res)=>{
    res.render("signup");
});

app.use(express.static("public"));

app.post("/login",async (req,res)=>{
   try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            res.send("Login Failed !!");
        }
        
        const isPassWordMatch = await bcrypt.compare(req.body.password,check.password);
        if(isPassWordMatch){
            res.render("home");
        }
        else{
            req.send("wrong Password");
        }
    }
    catch{
        res.send("wrong details");   
    }
});


// now were going to register a user if he/she clicked on signup link 
app.post("/signup", async (req,res)=>{
     // taking data from username and password field in signup page and saving it in constant data
     const data = {
        // <input type="text" id="name" name="username" placeholder="Enter your name" required autocomplete="off">
        name: req.body.username,
        // <input type="password" id="password" name="password" placeholder="password" required>
        password: req.body.password
    }

    // check if user already exist if it exists 
    const existingUser = await collection.findOne({name: data.name});

    if(existingUser){
        res.send("User already exists")
    }
    else{

        const hashedPass = await bcrypt.hash(data.password,10);
        data.password=hashedPass;

         // this code will send the data to your database
        const userdata = await collection.insertMany(data);

    // checking in terminal which kind of data is sending 
    console.log(userdata);

    //after this convert the data to json format so that it can be stored in the database
    }

   
})

   







const port = 5000;
app.listen(port, ()=>{
    console.log(`server running at: ${port}`);
})