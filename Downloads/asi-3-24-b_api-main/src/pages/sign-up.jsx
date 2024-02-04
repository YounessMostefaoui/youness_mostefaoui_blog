import { emailValidator, nameValidator, passwordValidator } from "@/utils/validators"
import Alert from "@/web/components/ui/Alert"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Link from "@/web/components/ui/Link"
import SubmitButton from "@/web/components/ui/SubmitButton"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { object } from "yup"

const initialValues = {
  email: "",
  password: "",
  datebirth: "",
  role: "user",
  activate: true,
}
const validationSchema = object({
  email: emailValidator.label("E-mail"),
  password: passwordValidator.label("Password"),
  datebirth: nameValidator.label("datebirth"),
  role: nameValidator.label("role"),
})
const roles = ["user", "author"]
// eslint-disable-next-line max-lines-per-function
const SignUpPage = () => {
  const { isSuccess, mutateAsync } = useMutation({
    mutationFn: (values) => apiClient.post("/users", values),
  })
  const handleSubmit = async (values) => {
    await mutateAsync(values)
    
    return true
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          We just sent you an e-mail. Please use the provided link to validate your account ❤️
        </Alert>
        <p>
          <Link href="/sign-in">Go to sign-in page.</Link>
        </p>
      </div>
    )
  }

  return (
    <>
      <Formik
  validationSchema={validationSchema}
  initialValues={initialValues}
  onSubmit={handleSubmit}
>
  {({ values, handleChange, handleBlur }) => (
    <Form>
      <FormField
        name="email"
        type="email"
        placeholder="Enter your e-mail"
        label="E-mail"
      />
      <FormField
        name="password"
        type="password"
        placeholder="Enter your password"
        label="Password"
      />
      <FormField
        name="datebirth"
        type="date"
        placeholder="aaaa/mm/jj"
        label="datebirth"
      />
      <div>
        <label htmlFor="role">Role: </label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton>Sign Up</SubmitButton>
    </Form>
  )}
</Formik>
    </>
  )
}

export default SignUpPage
