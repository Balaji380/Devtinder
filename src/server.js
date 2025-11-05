const express=require("express")
const app=express();
const connectDB=require("./config/database")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const authRouter=require("./Routes/authRouter")
const profileRouter=require("./Routes/profileRouter");
const requestRoute = require("./Routes/requestRoute");
const userRoute=require("./Routes/userRouter")

app.use(express.json())
app.use(cookieParser())


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRoute)
app.use("/",userRoute)

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


