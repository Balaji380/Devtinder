const express=require("express")
const userRouter=express.Router()
const userAuth=require("../middlewares/userAuth")
const ConnectionRequest=require("../model/connectionRequest")

const user_safe_data="firstName age "

userRouter.get("/user/received",userAuth,async(req,res)=>{

    try {
        const loggedUser=req.user;

        const connection=await ConnectionRequest.find(
            {
                toUserId:loggedUser._id,
                status:"interested"
            }
        )
        .populate("fromUserId","firstName age")


        res.json({
            message:"Retrived successfully",
            data:connection
        })

        
    } catch (error) {
        res.send("Error: "+error.message)
    }

})


userRouter.get("/user/connection",userAuth,async(req,res)=>{

    try {
        const loggedUser=req.user;

        const connection=await ConnectionRequest.find(
            {
                $or:[
                    {toUserId:loggedUser._id,status:"accepted"},
                    {fromUserId:loggedUser._id,status:"accepted"}
                ]
            }
        )
        .populate("fromUserId",user_safe_data)
        .populate("toUserId",user_safe_data)
        

        const data=connection.map((row)=>{
            if(row.fromUserId._id.toString()===loggedUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({message:data})

    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }
})



module.exports=userRouter