import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Resume from "../models/Resume.js"
import { response } from "express";

const generateToken =(userId)=>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: '7d'}

    )
    return token;
}


// POST : /api/users.register



// controller for user registration

export const registerUser = async(req, res) =>{
    try{

        const{ name, email, password} = req.body; 
        console.log(req);

        // check if required fields are correct

       if(!name || !email || !password){
    return res.status(400).jspn({message:' Missing required fields'}) // CRASHES HERE
    }

        const user = await User.findOne({email})

    if(user){
    return res.status(400).jspn({message:' User already exists'}) // CRASHES HERE
    }


        // create new user

        const hashedPassword = await bcrypt.hash(password,10)

        const  newUser = await User.create({

            name, email, password: hashedPassword
        })

        // return success message

        const token = generateToken(newUser._id)

        newUser.password = undefined;

        return res.status(201).json({message:" user created successfully", token, user: newUser})
    }
    catch(error){

        return res.status(400).json({message: error.message})

    }



}





// controller for user login
// POST : /api/users.register
export const loginUser = async(req, res) =>{
    try{

        const{ email, password} = req.body;

        // check if user exists

        const user = await User.findOne({email})

        if(!user){

            return res.status(400).json({message: 'Invalid email or password'})
        }

        

        

       // INSIDE registerUser:
    if(!name || !email || !password){
    return res.status(400).json({message:' Missing required fields'})
    }

    const user = await User.findOne({email})

    if(user){
    return res.status(400).json({message:' User already exists'})
    }


// INSIDE loginUser:
if(!user.comparePassword(password)){
    // Fixed typo and fixed the misleading error message
    return res.status(400).json({message:' Invalid password'}) 
}
        // create new user


        // return success message

        const token = generateToken(user._id)

        user.password = undefined;

        return res.status(200).json({message:" Login successfull", token, user})
    }
    catch(error){

        return res.status(400).json({message: error.message})

    }



}

// controller for getting user by id

// GET: /api/users/data

export const getUserById = async(req, res) =>{
    try{

        const userId = req.userId;

        // check if user exists

        const user = await User.findById(userId)

        if(!user){

             return res.status(404).json({message: 'User nor found'})


        }

        // return user

        user.password = undefined;

        return res.status(200).json({user})


        

        return res.status(200).json({message:" Login successfull", token, user})
    }
    catch(error){

        return res.status(400).json({message: error.message})

    }



}



//controller for getting user resumes

//GET: /api/users/resumes


export const getUserResumes = async(req, res) =>{

    try{

        const userId = req.userId;

        // return user resumes

        const resumes = await Resume.find({userId})

        return res.status(200).json({resumes})

    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
}




