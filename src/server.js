const express=require("express")
const app=express();
const connectDB=require("./config/database")
const User=require("./model/user")
const {validatesignupdata}=require("./utils/validation")
const bcrypt=require("bcrypt")

app.use(express.json())

app.post("/signup",async(req,res)=>{

   
    try {
        validatesignupdata(req);

        const {firstName,email,age,password}=req.body;

        const hasedPassword=await bcrypt.hash(password,10);

        const user=new User(
           { 
            firstName,
            email,
            age,
            password:hasedPassword
           }

        );
        await user.save()
         res.send("User saved successfully")
        
    } catch (error) {
        res.status(500).send("Error saving User data")
    }
    

})

app.post("/login",async(req,res)=>{
     
    try {
            const {email,password}=req.body;

            const user=await User.findOne({email:email})
            
            const isPassword=await bcrypt.compare(password,user.password)

            if(isPassword){
                res.send("User login successfully")
            }
            else{
                res.send("Invalid credentials")
            }
   

    } catch (error) {
        res.send("Something went wrong")
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


