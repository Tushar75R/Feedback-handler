import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmaiil(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "FEEDBACK MANAGER :  Verification mail",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "varification code send successfully" };
  } catch (error) {
    console.log("email component has error", error);
    return { success: false, message: "Failed to send email" };
  }
}
