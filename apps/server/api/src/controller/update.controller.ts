import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary';



export const updateBro = async(req:Request, res:Response) => {
try {
	const {profilePic} = req.body;
	const userId = req.user._id;

if(!profilePic){
	res.status(400).json({ message: 'Profile pic is required'});
	}
const uploadResponse = await cloudinary.uploder.upload(profilePic);

const updatedUser = await user.findByIdAndUpdate(userId, {profilePic:uploadRespponse.secure_url},{new:true});

res.status(200).json(updatedUser);

} catch (error) {
	console.log(error);
	res.status(500).json({message: 'internal server error'});
	}
};
