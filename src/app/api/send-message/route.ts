import { responseReturn } from "@/helpers/ResponseSender";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return responseReturn(false, "user not found", 404);
    }

    if (!user.isAcceptingMessage) {
      return responseReturn(false, "user is not accepted", 403);
    }

    const newMessage = { content, createdAt: new Date() } as Message;

    user.messages.push(newMessage);

    await user.save();

    return responseReturn(true, "message send successfully", 200);
  } catch (error) {
    console.log("send - messages", error);
    return responseReturn(false, "Internal Server Error", 500);
  }
}
