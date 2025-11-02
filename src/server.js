const express=require("express")
const app=express();
const connectDB=require("./config/database")
const User=require("./model/user")

app.use(express.json())

app.post("/signup",async(req,res)=>{

    const user=new User(req.body);
   
    try {
        await user.save()
       res.send("User saved successfully")
        
    } catch (error) {
        res.status(500).send("Error saving User data")
    }
    

})

//get user by email
app.get("/signup1",async(req,res)=>{
    const userEmail=req.body.email;
    try {
            const user=await User.find({email:userEmail});
            if(user.length===0){
                res.send("User not found")
            }
            else{
                res.send(user);
            }
            

    } catch (error) {
        res.send("something went wrong")
    }
})


app.get("/feed",async(req,res)=>{
     try {
        const user=await User.find({})
        res.send(user)
     } catch (error) {
        res.send("something went wrong")
     }
})


app.delete("/delete",async(req,res)=>{
     const userId=req.body.userId;
    try {
       const user= await User.findByIdAndDelete(userId)
       res.send("User deleted successfully")
    } catch (error) {
         res.send("something went wrong")
    }
})

app.patch("/update",async(req,res)=>{
    const userId=req.body.userId
    const data=req.body

    try {
        const user=await User.findByIdAndUpdate({_id:userId},data)
        res.send("User Updated successfully")
    } catch (error) {
         res.send("something went wrong")
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


