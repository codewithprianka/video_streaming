const User=require("../models/user_model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

// Register a new user
const registerUser=async(req,res)=>{
    const {name,email,password,cpassword}=req.body;
    if(!name || !email || !password || !cpassword){
        return res.status(400).json({message:"Please fill all fields"});
    }
    if(password!==cpassword){
        return res.status(400).json({message:"Passwords do not match"});
    }
    try {
        // Check if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        // Create new user
        const user=await User.create({
            name,
            email,
            password,
            cpassword
        });
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY});
        res.status(201).json({message:"User registered successfully",token});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
// Login user
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please fill all fields"});
    }
    try {
        // Check if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        // Check password
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY});
        res.status(200).json({message:"User logged in successfully",token});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// Get user profile
const getUserProfile=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
const validateUser=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    }catch (error) {
        res.status(500).json({message:error.message});
    }
}


module.exports={
    registerUser,
    loginUser,
    getUserProfile,
    validateUser
}