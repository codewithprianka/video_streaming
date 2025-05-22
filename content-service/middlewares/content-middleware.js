const jwt=require("jsonwebtoken");
const axios=require("axios");

const contentMiddleware=async(req,res,next)=>{
   
    let token=req.headers["authorization"];
    if(token && token.startsWith("Bearer")){
        token=token.split(" ")[1];
    }
  console.log(token);
    if(!token){
        return res.status(401).json({message:"Unauthorized hi"});
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(`${process.env.AUTH_SERVICE_URL}/api/auth/validate/${decoded.id}`);
        const response=await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/validateUser?did=${decoded.id}`);
        console.log(response);
        if(response.status!==200){
            return res.status(401).json({message:"Unauthorized attempt"});
        }
        console.log(response.data);
        req.user=response.data.user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized",error:error.message});
    }
}


module.exports=contentMiddleware;
