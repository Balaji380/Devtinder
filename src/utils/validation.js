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

module.exports={
    validatesignupdata
}