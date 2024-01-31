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

    // Vérifier le rôle de l'utilisateur
    if (payload && payload.role) {
      ctx.session = payload

      // Vous pouvez également stocker le rôle dans le contexte si nécessaire
      ctx.userRole = payload.role

      await next()
    } else {
      throw new ForbiddenError()
    }
  } catch (err) {
    throw new ForbiddenError()
  }
}

export default auth


