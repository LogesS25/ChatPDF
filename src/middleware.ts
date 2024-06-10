//special file - define code which should run before every routes
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware()

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.

  //regex which specifies when this middleware should run
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
