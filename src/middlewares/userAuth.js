const jwt=require("jsonwebtoken")
const User=require("../model/user")


const userAuth=async(req,res,next)=>{
    //read token from cookie

    try {
        const {token}=req.cookies

        if(!token){
            throw new Error("Token is Invalid")
        }

        //validate token

        const decodedMessage=await jwt.verify(token,"secret-key")
        
        const {_id}=decodedMessage

        const user=await User.findById(_id)

    if(!user){
        throw new Error("User Not found")
    }

    req.user=user

    next();
        
    } catch (error) {
        res.send(400).send(error.message)
    }
    


}






module.exports=(
    userAuth
)