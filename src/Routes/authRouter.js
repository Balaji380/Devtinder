const express=require("express")
const authRouter=express.Router()
const bcrypt=require("bcrypt")
const {validatesignupdata}=require("../utils/validation")
const User=require("../model/user")



authRouter.post("/signup",async(req,res)=>{

   
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
        console.log(user)
        await user.save()
         res.send("User saved successfully")
        
    } catch (error) {
        res.status(500).send("Error saving User data")
    }
    

})




authRouter.post("/login",async(req,res)=>{
     
    try {
            const {email,password}=req.body;

            const user=await User.findOne({email})
            if(!user){
                throw new Error("User Not Found")
            }
            
            const isPassword=await user.validatePassword(password)

            if(isPassword){            

            //create JWT token

            const token=await user.getJWT()

         

            res.cookie("token",token)
            res.send("User login sucess")

        
            }
            else {
                throw new Error("Invalid credentails")
            }
   

    } catch (error) {
        res.send("Something went wrong")
    }
})


authRouter.post("/logout",(req,res)=>{
    
    
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })

    res.send("Logout successfull")
})



module.exports=authRouter