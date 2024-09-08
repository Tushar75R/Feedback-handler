import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { responseReturn } from "@/helpers/ResponseSender";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();
  // const userId = new mongoose.Types.ObjectId("66d889158da4f35cf830ff0f");
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return responseReturn(false, "failed to update user", 401);
    }

    return responseReturn(true, "chaned acceptance", 200, updatedUser);
  } catch (error) {
    return responseReturn(false, "failed to update user status", 500);
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }

  const userId = user._id;
  // const userId = new mongoose.Types.ObjectId("66d889158da4f35cf830ff0f");

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return responseReturn(false, "User not found", 400);
    }
    return responseReturn(true, "Authenticated", 200, {
      isAcceptingMessage: user.isAcceptingMessage,
    });
  } catch (error) {
    return responseReturn(false, "failed to update user status", 500);
  }
}
