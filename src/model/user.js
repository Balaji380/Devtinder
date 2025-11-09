const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const validator = require("validator");


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
        },
        gender:{
            type:String,
            values:["Male","Female","Others"],
            message:`{VALUE} is not valid gender type`
        },
        photoURL:{
            type:String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
                }
            },
        },
        about:{
            type:String,
        },
        skills:{
            type:[String],
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