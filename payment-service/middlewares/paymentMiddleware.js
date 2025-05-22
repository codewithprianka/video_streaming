const jwt=require("jsonwebtoken");
const axios=require("axios");

const paymentMiddleware=async(req,res,next)=>{
   
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
        const response=await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/validateUser?did=${decoded.id}`);
        if(response.status!==200){
            return res.status(401).json({message:"Unauthorized attempt"});
        }
        console.log(response.data);
        req.user=response.data.user;
        console.log(req.user._id);
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized",error:error.message});
    }
}


module.exports=paymentMiddleware;
