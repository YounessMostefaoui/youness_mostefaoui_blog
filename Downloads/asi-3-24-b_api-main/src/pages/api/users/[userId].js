import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  emailValidator,
  passwordValidator,
  nameValidator,
  statusValidator
} from "@/utils/validators"

const handle = mw({
  GET: [
    auth,
    validate({
      query: {
        userId: idValidator,
      },
    }),
    async ({
      models: { UserModel },
      input: {
        query: { userId },
      },
      res,
    }) => {
      const user = await UserModel.query().findById(userId).throwIfNotFound()

      res.send(user)
    },
  ],
  PATCH: [
    auth,
    validate({
      query: {
        userId: idValidator,
      },
      body: {
        firstname: nameValidator.optional(),
        lastname: nameValidator.optional(),
        datebirth: nameValidator.optional(),
        email: emailValidator.optional(),
        password: passwordValidator.optional(),
        activate: statusValidator.optional(),
      },
    }),
    async ({
      models: { UserModel },
      input: {
        body,
        query: { userId },
      },
      res,
    }) => {
      const updatedUser = await UserModel.query()
        .updateAndFetchById(userId, {
          ...body,
          updatedAt: UserModel.fn.now(),
        })

      res.send(updatedUser)
    },
  ],
  DELETE: [
    auth,
    validate({
      query: {
        userId: idValidator,
      },
    }),
    async ({
      models: { UserModel },
      input: {
        query: { userId },
      },
      res,
    }) => {
      const user = await UserModel.query().findById(userId).throwIfNotFound()

      await user.$query().delete()

      res.send(user)
    },
  ],
})

export default handle
