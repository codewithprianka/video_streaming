const jwt=require("jsonwebtoken");
const User=require("../models/user_model");


const authMiddleware=async(req,res,next)=>{
    let token=req.headers["authorization"];
    if(token && token.startsWith("Bearer")){
        token=token.split(" ")[1];
    }
    console.log(token);
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    }
}


module.exports=authMiddleware;
