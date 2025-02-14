import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../Middleware/SendMail.js";
//new user registeration
export const registerUser = async (req, res)=>{
    try {
        
        const {name, email, password, contact} = req.body;
        let user = await User.findOne({ email});
        // code to check email address already exists
        if (user){
            return res.status(400).json({
                message: "User email Already exists",
            });
        }
        // code to convert raw password to hashed password
        const hashpassword = await bcrypt.hash(password,10);

        // code for Generate OTP 
        const otp = Math.floor(Math.random()*1000000);

        // create new user data
        user = { name, email, hashpassword, contact};

        // create signed activation token
        const activationToken = jwt.sign({user,otp}, process.env.ACTIVATION_SECRET,{
            expiresIn: "5m",
        });

        // send email to user
        const message= ` please verify your account using otp your otp is ${otp}`;
        await sendMail(email,"welcome to my Ecommerce webpage",message);

        return res.status(200).json({
            message: "OTP sent to your mail",
            activationToken,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });

    }
};

// verify otp
export const verifyUser = async (req,res )=>{
    try {
        
        const {otp, activationToken}= req.body;
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
        if(!verify){
            return res.json({
                message: "OTP expired"
            });
        }
        if(verify.otp !== otp){
            return res.json({
                message: "Wrong OTP"
            });
        }
        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashpassword,
            contact : verify.user.contact,
        });
        
        return res.status(200).json({
            message: "User Verified Successfully",
        });
        } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


export const loginUser = async (req, res)=>{
    try {
        const {email , password}= req.body;
        //check User email address
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                messsage: "Invalid Credentials",
            });
        }
        // check password 
        const matchpassword= await bcrypt.compare(password, user.password);
        if(!matchpassword){
            return res.status(400).json({
                message: " Invalid Credentials",
            });
        }
        //generate signed token
        const token = jwt.sign({_id: user.id},process.env.JWT_SECRET,{expiresIn: "15d"});
        //excluding the password feild before sending response
        const {password : userPassword, ...userDetails} =user.toObject();
        return res.status(200).json({
            message: "Welcome "+user.name,
            token,
            userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//user profile

export const myProfile = async(req, res)=>{
    try {
        
        const user= await User.findById(req.user._id).select("-password");
        return res.status(200).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
};