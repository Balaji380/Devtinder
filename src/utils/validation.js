const validator=require("validator")

const validatesignupdata=(req)=>{
   const {firstName,email,age,password}=req.body;
   if(!firstName){
    throw new Error("Enter FirstName")
   }
   if(!validator.isEmail(email)){
        throw new Error("Email is not valid")

   }

   if(!age){
    throw new Error("Age is not valid")
   }

   if(!validator.isStrongPassword(password)){
    throw new Error("Please enter Strong password")
   }

}


const validateProfileEdit=(req)=>{
    const allowedUpdates=[
     "firstName",
    "age",
    "gender",
    "about",
    "skills",
    "photoURL",]

    const isEditAllowed=Object.keys(req.body).every(key=>allowedUpdates.includes(key))

    return isEditAllowed

}
module.exports={
    validatesignupdata,
    validateProfileEdit
}