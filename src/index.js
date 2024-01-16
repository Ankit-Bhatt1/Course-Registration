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


// app.get("/course-detail", (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/course_detail_1.html'));
// });

app.get("/", (req , res)=>{
    res.render("login");
});

app.get("/signup", (req , res)=>{
    res.render("signup");
});

app.get("/home", (req , res)=>{
    res.render("home");
});

app.get("/form", (req , res)=>{
    res.render("form");
});

app.get("/profile", (req , res)=>{
    res.render("profile");
});

app.get("/change", (req , res)=>{
    res.render("change_password");
});

app.use(express.static("public"));

app.post("/login",async (req,res)=>{
   try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            // res.send("Login Failed !!");
            return res.render("login", { loginFailed: "User not found!" });
        }
        // console.log(typeof req.body.password, typeof check.password);

        const isPassWordMatch = await bcrypt.compare(req.body.password,check.password);
        // const isPasswordMatch = req.body.password === check.password;
        if(isPassWordMatch){
            res.render("home");
        }
        else{
            req.send("wrong Password");
        }
    }
    catch{
        res.render("login", { loginFailed: "Login failed. Please try again." });  
    }
});


// now were going to register a user if he/she clicked on signup link 
app.post("/signup", async (req,res)=>{
     // taking data from username and password field in signup page and saving it in constant data
     const data = {
        // <input type="text" id="name" name="username" placeholder="Enter your name" required autocomplete="off">
        name: req.body.username,
        // <input type="password" id="password" name="password" placeholder="password" required>
        password: req.body.password,

        regId: req.body.regId,

        rollno: req.body.rollno
    }

    // check if user already exist if it exists 
    const existingUser = await collection.findOne({name: data.name});

    if(existingUser){
        res.send("User already exists")
    }
    else{

        const hashedPass = await bcrypt.hash(data.password,10);
        // const hashedPass=data.password;
        data.password=hashedPass;

         // this code will send the data to your database
        const userdata = await collection.insertMany(data);

    // checking in terminal which kind of data is sending 
    console.log(userdata);
    res.render("success");

    //after this convert the data to json format so that it can be stored in the database
    }

   
})



app.post("/StudentInfo", async (req, res) => {
    try {
        const regId = req.body.regId;

        // Assuming you have a method to query the database based on regId
        const user = await collection.findOne({ regId });

        if (user) {
            // Render a new page with the user's information
            res.render("userInfo", { username: user.name, password: user.password });
        } else {
            // Render a page indicating that the user was not found
            res.render("error");
        }
    } catch (error) {
        console.error("Error querying user data:", error);
        res.status(500).render("errorPage", { errorMessage: "Internal server error" });
    }
});
   


// 
app.post('/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
  
    try {
      // Find the user by username and current password
      const user = await User.findOne({ username, password: currentPassword });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Update the password with the new one
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  




const port = 5000;
app.listen(port, ()=>{
    console.log(`server running at: ${port}`);
})