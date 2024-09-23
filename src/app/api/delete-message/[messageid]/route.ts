import { responseReturn } from "@/helpers/ResponseSender";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }
  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount === 0) {
      return responseReturn(false, "Message not found or already deleted", 404);
    }
    return responseReturn(true, "Message deleted successfully", 200);
  } catch (error) {
    console.error("error while deleteing message", error);
    return responseReturn(false, "Internal Server Error", 500);
  }
}
