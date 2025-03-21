export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    "/((?!api|recipes\\?.*|category|recipes|search|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.txt$|.*\\.xml$|$).*)",
  ],
};