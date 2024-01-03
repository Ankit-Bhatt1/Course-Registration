// importing mongoose module 
const mongoose = require("mongoose");

// establishin connection with database 
// const connect = mongoose.connect("path_of_your_database");

const connect = mongoose.connect("mongodb://127.0.0.1:27017/StudentDatabase");//tried -> "mongodb://localhost:27017/StudentDatabase" but didnt work for me 

//checking if database is connected or not for that use then and catch method
connect.then(()=>{
    console.log("CONNECTED!!");
})  
.catch((error)=>{
    console.log("CONNECTION FAILED !!",error.message);
});



// creating schema in your database
// as we need two input from user to save in database 
// therefore 2 schema is created name and password  
const LoginSchema = new mongoose.Schema({
     name:  {
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});


// creating a model 
// const collection = new mongoose.model("collection_name", schema_name);
const collection = new mongoose.model("Student", LoginSchema);

// exporting this model 
module.exports = collection;

// Now you have to import the model you created in index.js file 
