import { authClient } from "@/lib/auth-client";

export async function getClientToken() {
  const { data: token } = await authClient.token();
  console.log("token found", token);
  return token?.token;
}
