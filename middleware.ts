export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|recipes|_next/static|_next/image|favicon.ico).*)"],
}