import { loginUser, signupUser } from "../managers/auth.manager.js";
import { generateTokenAndSetCookie } from "../utils/helper/token.js";

export const signupController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await signupUser({ username, email, password });

     // Generate JWT token and  Express sends this cookie  header to the client and the browser  will store it as a cookie
     generateTokenAndSetCookie(newUser._id,res);

     res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error); 
    console.error("Signup error: ",error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await loginUser({ username, password });
    
    generateTokenAndSetCookie(user._id, res);
    
    res.status(200).json({
      success: true,
       user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    
  } catch (error) {
    next(error);
    console.error("Login error:", error); 
  }
};

export const logoutController = (req, res, next) => {
  try {
    res.clearCookie('jwt', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
    console.error("Logout error:", error);
  }
};

export const checkauth = async(req,res,next)=>{
    try{
		const user= req.user;
    return res.status(200).json(
      { message:"authorized user",
         user
		 });

    }catch(error){
      next(error);
      console.error("Error :",error);
    }
};