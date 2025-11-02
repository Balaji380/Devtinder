const express=require("express")
const app=express();
const connectDB=require("./config/database")
const User=require("./model/user")



app.post("/signup",async(req,res)=>{

    const userObj={
        firstName:"Balaji",
        email:"balu@gmail.com",
        age:20
    }

    const user=new User(userObj);
   
    try {
        await user.save()
       res.send("User saved successfully")
        
    } catch (error) {
        res.status(500).send("Error saving User data")
    }
    

})




connectDB()
    .then(()=>{
     console.log("Database connected successfully")
    app.listen(3000,(req,res)=>{
    console.log("Server is running at port 3000")
    })
   })
   .catch((err)=>{
     console.log("Database cannot be connected")
   })


