import { boolean, number, string, date } from "yup"

export const nameValidator = string().required()
export const emailValidator = string().email().required()
export const passwordValidator = string()
  .min(10)
  .matches(
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\d)]).*$/gu,
    "Password must contain 1 upper & 1 lower letter, 1 digit and 1 spe. char.",
  )
  .required()
export const postDescriptionValidator = string().min(8).required()
export const postNameValidator = string().min(4).required()
export const categoryNameValidator = string().min(8).required()
export const statusValidator = boolean().required()
export const idValidator = number().integer().min(1).required()
export const pageValidator = number().integer().min(1).default(1).required()
export const roleValidator = string().required()
export const dateValidator = date()
