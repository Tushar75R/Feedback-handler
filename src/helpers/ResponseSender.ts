export function responseReturn(
  success: boolean,
  message: string,
  status?: number,
  other?: any
): Response {
  return Response.json({ success, message, other }, { status });
}
