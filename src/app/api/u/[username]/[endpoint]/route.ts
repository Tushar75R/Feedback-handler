import { responseReturn } from "@/helpers/ResponseSender";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/user";

export async function GET(
  request: Request,
  { params }: { params: { username: string; endpoint: string } }
) {
  dbConnect();
  const { username, endpoint } = params;
  console.log(username, endpoint);
  const user = await UserModel.findOne({
    username,
  });
  if (!user) return responseReturn(false, "User not found", 404);

  const messages = user.messages.filter((m) => m.endpoint === endpoint);
  console.log(messages);
  return responseReturn(true, "Done", 200, { messages });
}

export async function POST(
  request: Request,
  { params }: { params: { username: string; endpoint: string } }
) {
  dbConnect();
  const { name, content, email } = await request.json();
  const { username, endpoint } = params;
  const user = await UserModel.findOne({ username });
  if (!user) return responseReturn(false, "User not found", 404);
  const url = user?.urls.filter((u) => u.endpoint === endpoint);
  console.log();
  if (!url || url.length === 0)
    return responseReturn(false, "Url not found", 404);
  if (!url[0].isAcceptingMessage) {
    return responseReturn(false, "user is not accepting messages", 403);
  }

  const newMessage = {
    title: name,
    content,
    email,
    createdAt: new Date(),
    endpoint,
  } as Message;

  user.messages.push(newMessage);

  await user.save();
  return Response.json({ success: "true", message: "Done" }, { status: 200 });
}
