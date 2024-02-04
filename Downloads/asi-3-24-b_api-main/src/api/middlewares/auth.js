import { ForbiddenError } from "@/api/errors"
import config from "@/config"
import jsonwebtoken from "jsonwebtoken"

const auth = async (ctx) => {
  const {
    req: {
      cookies: { [config.security.jwt.cookieName]: sessionToken },
    },
    next,
  } = ctx

  try {
    const { payload } = jsonwebtoken.verify(
      sessionToken,
      config.security.jwt.secret,
    )

    if (!(payload && payload.role)) {
      throw new ForbiddenError("Permission denied")
    }

    const userProfile = {
      id: payload.id,
      firstname: payload.firstname,
      lastname: payload.lastname,
      role: payload.role,
      activate: payload.activate,
    }

    ctx.session = payload
    ctx.userProfile = userProfile
    ctx.userRole = payload.role

    if (ctx.userRole !== "admin" && isDeletingPost(ctx)) {
      throw new ForbiddenError("Permission denied: Admin role required to delete a post")
    }

    if (ctx.userRole !== "author" && isPatchgPost(ctx)) {
      throw new ForbiddenError("Permission denied: Author role required to patch a post")
    }

    await next()
  } catch (err) {
    throw new ForbiddenError("Permission denied")
  }
}
const isDeletingPost = (ctx) =>
  ctx.req.method === "DELETE" && ctx.req.url.includes("/posts/")
const isPatchgPost = (ctx) =>
  ctx.req.method === "PATCH" && ctx.req.url.includes("/posts/")


export default auth
