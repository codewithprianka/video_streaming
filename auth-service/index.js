const express=require("express");
const app=express();
const dotenv=require("dotenv");
const connectDB=require("./models/connection");
const authRouter=require("./routes/auth_route")


dotenv.config({path:"./config.env"});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/auth",authRouter);


connectDB();
app.listen(process.env.PORT,()=>{
    console.log("listening")
});