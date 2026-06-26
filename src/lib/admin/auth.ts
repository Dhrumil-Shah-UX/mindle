import { env } from "@/lib/env";

export function adminSecretRequired(): boolean {
  return Boolean(env.adminSecret?.trim());
}

export function verifyAdminPassword(password: string): boolean {
  if (!adminSecretRequired()) return true;
  return password === env.adminSecret;
}

export function assertAdminPassword(password: string): void {
  if (!verifyAdminPassword(password)) {
    throw new Error("Unauthorized");
  }
}
