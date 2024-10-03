import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { responseReturn } from "@/helpers/ResponseSender";
import UserModel, { Url } from "@/model/user";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }

  const { newUrl, endpoint } = await request.json();

  if (!newUrl || typeof newUrl !== "string") {
    return responseReturn(false, "Invalid URL provided", 400);
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return responseReturn(false, "User not found", 404);
    }

    const tempUrl = { url: newUrl, endpoint, isAcceptingMessage: true } as Url;

    if (user.urls.includes(tempUrl)) {
      return responseReturn(false, "URL already exists", 400);
    }

    user.urls.push(tempUrl);
    await user.save();

    return responseReturn(true, "URL added successfully", 200, {
      urls: user.urls,
    });
  } catch (error) {
    console.error("Error adding new URL:", error);
    return responseReturn(false, "Internal Server Error", 500);
  }
}
