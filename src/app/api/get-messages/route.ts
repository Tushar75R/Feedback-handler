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
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user) {
      return responseReturn(false, "no User found", 400);
    }
    return responseReturn(true, "user found", 200, {
      messages: user[0]?.messages,
    });
  } catch (error) {
    console.log("get - message ", error);
    return responseReturn(false, "not authenticated", 500);
  }
}
