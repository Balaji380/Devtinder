const mongoose=require("mongoose")

const connectionRequestSchema=mongoose.Schema(
   {
     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId
       },
    status:{
        type:String,
        enum:{
            values:['interested','rejected','accepted','ignored'],
            message:'{VALUE} is not valid',
        
        },
       }
  },{
    timestramp:true
  }
)

connectionRequestSchema.index({fromUserId:1,toUserId:1})



connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Same user cannot send request")
    }
    next()

})


module.exports =mongoose.model("ConnectionRequest",connectionRequestSchema);