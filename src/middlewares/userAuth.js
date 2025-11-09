const jwt=require("jsonwebtoken")
const User=require("../model/user")


const userAuth=async(req,res,next)=>{
    //read token from cookie

    try {
        const {token}=req.cookies

        if(!token){
            return res.status(401).json({message:"Please login first"})
        }

        //validate token

        const decodedMessage=await jwt.verify(token,"secret-key")
        
        const {_id}=decodedMessage

        const user=await User.findById(_id)

    if(!user){
        return res.status(401).json({ message: "User not found" });
    }

    req.user=user

     next();
        
    } catch (error) {
    return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    


}






module.exports=(
    userAuth
)