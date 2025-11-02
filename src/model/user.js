const mongoose=require("mongoose")

const userSchema=mongoose.Schema(
    {
        firstName:{
            type:String
        },
        email:{
            type:String
        },
        age:{
            type:Number
        }
    }
)


module.exports=mongoose.model("User",userSchema)