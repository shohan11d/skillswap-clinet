import { NextResponse } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'
 
export async function proxy(request) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if(!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
}
 

 
export const config = {
  matcher: ['/dashboard', '/dashboard/client', '/dashboard/client/tasks/new', '/dashboard/client/tasks','/dashboard/client/proposals', '/dashboard/client/payments', '/dashboard/freelancer', '/destinations/:path','/dashboard/freelancer/tasks', '/dashboard/freelancer/tasks', '/dashboard/freelancer/proposals', '/dashboard/freelancer/profile', ],
}