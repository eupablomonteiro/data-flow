import { api } from "@/lib/api/client";
import { User } from "@/types/auth";

export async function getMe(): Promise<User> {
  const response = await api.get("/auth/me");
  return response.data;
}
