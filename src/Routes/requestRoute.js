const express=require("express")
const requestRoute=express.Router()
const userAuth=require("../middlewares/userAuth")
const ConnectionRequest=require("../model/connectionRequest")
const User=require("../model/user")


requestRoute.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
   
     try {
          const fromUserId=req.user._id
          const toUserId=req.params.toUserId
          const status=req.params.status
          

          const allowedStatus=["interested","rejected"]

          if(!allowedStatus.includes(status)){
              throw new Error("Invalid Status")
          }



          const toUser=await User.findById(toUserId)
          if(!toUser){
             throw new Error("This is not found in DB")
          }


          const existingConnection=await ConnectionRequest.findOne(
            {
                $or:[
                        {fromUserId,toUserId},
                        {fromUserId:toUserId,toUserId:fromUserId}

                    ]
               }
          )
          if(existingConnection){
            return  res.status(400).send("Connection Already Exists")
          }


          const connectionRequest=new ConnectionRequest(
            {
                fromUserId,
                toUserId,
                status
            }
          )
         
           const data=await connectionRequest.save()
           
           res.json({
            message:"connection request send successfully",
            data
           })
        
     } catch (error) {
        res.status(400).send("Error: "+error.message)
     }

})


requestRoute.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{

        try {
          const loggedUser=req.user;
          const allowedStatus=["accepted","ignored"]
          const {status,requestId}=req.params

          if(!allowedStatus.includes(status)){
              return res.status(400).send("Invalid status")
          }


          const connection=await ConnectionRequest.findOne(
            {
              _id:requestId,
              toUserId:loggedUser._id,
              status:"interested"
            }
          )

          if(!connection){
             return res.send("Connection request not found")
          }

          connection.status=status

          await connection.save()
          res.json({data:connection})
          
        } catch (error) {
          res.status(400).send("Error: "+error.message)
        }

})


module.exports=requestRoute