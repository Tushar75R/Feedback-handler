import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCanNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCanNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user is verified",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "verification code is invalid",
        },
        {
          status: 500,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "verification code is expired, please sign up again",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error in verifiation", error);
    return Response.json(
      {
        success: false,
        message: "error in verification",
      },
      {
        status: 500,
      }
    );
  }
}
