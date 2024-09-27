import { responseReturn } from "@/helpers/ResponseSender";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  dbConnect();
  const { name, content, email } = await request.json();
  const username = params.username;
  const user = await UserModel.findOne({ username });
  if (!user?.isAcceptingMessage) {
    return responseReturn(false, "user is not accepted", 403);
  }
  if (!user) return responseReturn(false, "User not found", 404);

  const newMessage = {
    title: name,
    content,
    email,
    createdAt: new Date(),
  } as Message;

  user.messages.push(newMessage);

  await user.save();
  return Response.json({ success: "true", message: "Done" }, { status: 200 });
}
