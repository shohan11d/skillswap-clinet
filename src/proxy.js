import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/client",
    "/dashboard/client/tasks/new",
    "/dashboard/client/tasks",
    "/dashboard/client/proposals",
    "/dashboard/client/payments",
    "/dashboard/freelancer",
    "/dashboard/freelancer/tasks",
    "/dashboard/freelancer/earnings",
    "/dashboard/freelancer/projects",
    "/dashboard/freelancer/proposals",
    "/dashboard/freelancer/profile",
    "/dashboard/admin/users",
    "/dashboard/admin/tasks",
    "/dashboard/admin/transactions",
    "/pricing/success",
  ],
};
