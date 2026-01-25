import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies, headers } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
  await cookies();
  await headers();
  const params = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (NextAuth as any)(req, { params }, authOptions);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: Request, context: any) {
  await cookies();
  await headers();
  const params = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (NextAuth as any)(req, { params }, authOptions);
}
