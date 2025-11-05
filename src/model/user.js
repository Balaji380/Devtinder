const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

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
        },
        password:{
            type:String
        }
    },
    {
        timestamps:true
    }
)


userSchema.methods.getJWT=async function () {
    const user=this
    const token=await jwt.sign({_id:user._id},"secret-key",{expiresIn:"1d"})

    return token

}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this
    const hasedPassword=user.password

     const isPassword=await bcrypt.compare(passwordInputByUser,hasedPassword)
     return isPassword
}


module.exports=mongoose.model("User",userSchema)