"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSessionFromPassword } from "@/lib/admin-session";

export async function adminLoginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const ok = await setAdminSessionFromPassword(password);
  if (!ok) {
    redirect("/admin?login=fail");
  }
  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin");
}
