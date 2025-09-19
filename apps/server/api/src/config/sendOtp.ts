import dotenv from 'dotenv';
dotenv.config();

import { redisClient } from './redis';
import { generateOTP } from '../utils/generateOtp';
//import axios from 'axios';



export const sendOtp = async (mobile: string): Promise<string> => {
  //validate 10-digit mobile number
  const isValid = /^[6-9]\d{9}$/.test(mobile);
  if (!isValid) {
    throw new Error('Mobile number required');
  }

  const otp = generateOTP(); //take generated otp

  //const fullNumber = `+91${mobile}`; //assuming user are indian

  try {
    // Store OTP in Redis
    await redisClient.setEx(`otp:${mobile}`, 300, otp); //expire in 5 min
    console.log(otp);
/*
console.log('API KEY:', process.env.FAST2SMS_API_KEY);
    // Send OTP Via SMS
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'q',
        message: `your OTP is ${otp}`,
        numbers: mobile,
	flash: 0
      },
      {
        headers: {
         authorization: process.env.FAST2SMS_API_KEY,
        },
      },
    );
    console.log('FASAT2SMS Response:', response.data);*/
    return 'OTP Sent Successfully';
    //res.status(200).json({message:"Otp sent successfully"}) --this is use when you use (req,res) in function--
  } catch (err: any) {
    console.error('FAST2SMS Error', err.response?.data || err.message);
    throw new Error('Failed to sned OTP');
  }
};
