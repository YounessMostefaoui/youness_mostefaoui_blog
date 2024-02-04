import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { emailValidator, passwordValidator, roleValidator, pageValidator, statusValidator, nameValidator } from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  POST: [
    validate({
      body: {
        email: emailValidator,
        datebirth: nameValidator,
        role: roleValidator,
        password: passwordValidator,
        activate: statusValidator,
      },
    }),
    async ({
      input: {
        body: {email, datebirth, role, password, activate },
      },
      models: { UserModel },
      res,
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: true })

        return
      }

      const [passwordHash, passwordSalt] =
        await UserModel.hashPassword(password)

      await UserModel.query().insertAndFetch({
        email,
        datebirth,
        role,
        passwordHash,
        passwordSalt,
        activate,
      })

      res.send({ result: true })
    },
  ],
  GET: [
  validate({
    query: {
      id: nameValidator.optional(),
      page: pageValidator.optional(),
    },
  }),
  async ({
    res,
    models: { UserModel },
    input: {
      query: { id, page },
    },
  }) => {
    try {
      const usersQuery = UserModel.query()

      if (id) {
        const user = await UserModel.query().findOne({ id })

        if (user) {
          res.send({
            result: [user],
            meta: {
              count: 1,
            },
          })

          return
        }
      }

      const users = await usersQuery
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count }] = await UserModel.query().count()

      res.send({
        result: users,
        meta: {
          count,
        },
      })
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  },
],


})

export default handle
