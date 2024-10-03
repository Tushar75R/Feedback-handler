import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

import { sendVerificationEmaiil } from "@/helpers/sendVerificationEmail";
import { responseReturn } from "@/helpers/ResponseSender";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByemail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByemail) {
      if (existingUserByemail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user with this email already exists",
          },
          { status: 400 }
        );
      } else {
        const hasedpassword = await bcrypt.hash(password, 10);
        existingUserByemail.password = hasedpassword;
        existingUserByemail.verifyCode = verifyCode;
        existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByemail.save();
      }
    } else {
      const hasedpassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hasedpassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
        urls: [],
      });
      await newUser.save();
      console.log(newUser);
    }

    const emailResponse = await sendVerificationEmaiil(
      username,
      email,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 5000,
        }
      );
    }
    return responseReturn(
      true,
      "user register successfully, please verify your email",
      200
    );
  } catch (error) {
    console.log("Error while Registering user", error);
    return responseReturn(false, "Error while Registering user", 500);
  }
}
