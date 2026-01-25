import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies, headers } from "next/headers";

export async function GET(req: Request, context: any) {
  await cookies();
  await headers();
  const params = await context.params;
  return (NextAuth as any)(req, { params }, authOptions);
}

export async function POST(req: Request, context: any) {
  await cookies();
  await headers();
  const params = await context.params;
  return (NextAuth as any)(req, { params }, authOptions);
}
