import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
    
 //Token is temporarily stored as a "Set-Cookie" header  in the response object
	res.cookie("jwt", token, {
		maxAge: 2 * 24 * 60 * 60 * 1000, 
		httpOnly: true, 
		secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
	});
};