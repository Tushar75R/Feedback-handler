import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Url } from "@/model/user";
import { User } from "next-auth";
import { responseReturn } from "@/helpers/ResponseSender";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return responseReturn(false, "Not Authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessages = undefined, endpoint } = await request.json();
  // const userId = new mongoose.Types.ObjectId("66d889158da4f35cf830ff0f");
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return responseReturn(false, "user not found", 404);
    }
    if (acceptMessages === undefined) {
      const isAcceptingMessage = user.urls.find(
        (u) => u.endpoint == endpoint
      )?.isAcceptingMessage;
      return responseReturn(true, "change successfully", 200, {
        isAcceptingMessage,
      });
    }
    const updatedUrls = user.urls.map((url) => {
      if (url.endpoint == endpoint) {
        url.isAcceptingMessage = acceptMessages;
      }
      return url;
    }) as Url[];
    user.urls = updatedUrls;
    await user.save();
    return responseReturn(true, "change successfully", 200);
  } catch (error) {
    return responseReturn(false, "failed to update user status", 500);
  }
}

// export async function GET(request: Request) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);
//   const user: User = session?.user as User;

//   if (!session || !session.user) {
//     return responseReturn(false, "Not Authenticated", 401);
//   }

//   const userId = user._id;
//   // const userId = new mongoose.Types.ObjectId("66d889158da4f35cf830ff0f");

//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return responseReturn(false, "User not found", 400);
//     }
//     return responseReturn(true, "Authenticated", 200, {
//       isAcceptingMessage: user.isAcceptingMessage,
//     });
//   } catch (error) {
//     return responseReturn(false, "failed to update user status", 500);
//   }
// }
