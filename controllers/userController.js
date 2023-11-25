const asyncHandler = require("express-async-handler");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route get /api/users/register
//@acess public
const registerUser =asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable)
    {
        res.status(400);
        throw new Error("User already registered");
    }
    
    //Hash Password
    const hashedPassword = await bcyrpt.hash(password,10); // here 10 is the level of salting
    const newuser = await User.create({
        username,email,password: hashedPassword
    });
    console.log(`User created ${newuser}`);
    if(newuser)
    {
        res.status(201).json({"_id": newuser.id,"email":newuser.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({"message":"Register the user"});
});

//@desc login the user
//@route get /api/users/login
//@acess public
const loginUser =asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email})
    //compare password received from client with hashed password
    if(user && (await bcyrpt.compare(password,user.password))){
        // if the user exists and his login details are correct, we 
        // send him a jwt access token.
        // to generate this, we use jsonaccesstoken library functions
        // jwt.sgin() generates access token. 
        // it requires, the user information, a secret and additional info like 
        // expiration time
        const accessToken = jwt.sign({user: {
                username:user.username,
                email: user.email,
                id: user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.status(200).json({accessToken})
    }
    else{
        res.status(401);
        throw new Error("email or password is not valid");

    }
    
});

//@desc current info of the user
//@route get /api/users/current
//@acess private
const currentUser =asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser}