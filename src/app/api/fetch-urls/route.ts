import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { responseReturn } from "@/helpers/ResponseSender";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return responseReturn(false, "no User found", 400);
    }
    return responseReturn(true, "user found", 200, {
      urls: user.urls,
    });
  } catch (error) {
    console.log("get - urls ", error);
    return responseReturn(false, "error in fetch urls", 500);
  }
}
