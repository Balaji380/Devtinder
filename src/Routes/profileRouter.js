const express=require("express")
const profileRouter=express.Router()
const userAuth=require("../middlewares/userAuth")
const {validateProfileEdit}=require("../utils/validation")
const bcrypt=require("bcrypt")
const validator=require("validator")





profileRouter.get("/profile/view",userAuth,(req,res)=>{
     try {
        const user=req.user
        res.send(user)
     } catch (error) {
        res.send("something went wrong")
     }
})


profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

    try {
       if(!validateProfileEdit(req)){
           throw new Error("Invalid edit request")

       }

       const loggedUser=req.user

       Object.keys(req.body).forEach(key=>loggedUser[key]=req.body[key])


       await loggedUser.save()
       res.send("Profile Updated Successfully")


    } catch (error) {
        res.send("Error: "+error.message)
    }
})



profileRouter.patch("/profile/password",userAuth,async(req,res)=>{

    try {
        const loggedUser=req.user;
        const hasedPassword=loggedUser.password;
        const {password,newPassword}=req.body

        const isValid=await bcrypt.compare(password,hasedPassword)
        if(!isValid){
            throw new Error("Enter correct password ")
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter Strong Password")
        }

        const hashedPwd=await bcrypt.hash(newPassword,10);
        
        loggedUser.password=hashedPwd

        await loggedUser.save();
        res.send("Password Updated successfully")
        
    } catch (error) {
        res.send("Error: "+error.message)
    }
})



module.exports=profileRouter;