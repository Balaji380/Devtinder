const express=require("express")
const userRouter=express.Router()
const userAuth=require("../middlewares/userAuth")
const ConnectionRequest=require("../model/connectionRequest")
const User=require("../model/user")

const user_safe_data="firstName age gender photoURL about skills"

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

        res.json({data})

    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }
})



userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;

        limit=limit>50?50:limit

        const skip=(page-1)*limit

        const connection=await ConnectionRequest.find(
           {$or:[
            {fromUserId:loggedUser._id},
            {toUserId:loggedUser._id}
           ] }
        )
        .select("fromUserId toUserId")

        const hideUserFromFeed=new Set()
        connection.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId),
            hideUserFromFeed.add(req.toUserId)
        })

        const users=await  User.find(
            {
                $and:[
                    {_id:{$nin:Array.from(hideUserFromFeed)}},
                    {_id:{$ne:loggedUser._id}}

                    ]
            }
        )
        .select(user_safe_data)
        .skip(skip)
        .limit(limit)

        res.json({data:users})
        
    } catch (error) {
       res.send("Error: "+error.message) 
    }
})



module.exports=userRouter