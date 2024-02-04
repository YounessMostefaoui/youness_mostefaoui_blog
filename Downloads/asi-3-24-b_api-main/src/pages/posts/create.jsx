import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import axios from "axios"
import { Formik } from "formik"
import { object, number } from "yup"
import { nameValidator, postDescriptionValidator } from "@/utils/validators"
import config from "@/config"
import jsonwebtoken from "jsonwebtoken"
import apiClient from "@/web/services/apiClient"

export const getServerSideProps = async ({ req, query: { page } }) => {
  try {
    const { payload } = jsonwebtoken.verify(
      req.cookies[config.security.jwt.cookieName],
      config.security.jwt.secret
    )
    const userid = payload ? payload.id : null
    const data = await apiClient("/users", { params: { id: userid, page } })
    const userRole = payload ? payload.role : null

    return {
      props: { initialData: data, userid, user: payload, userRole },
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    }
  }
}
const initialValues = {
  name: "",
  description: "",
  categoryId: "",
}
const validationSchema = object({
  name: nameValidator.label("name"),
  description: postDescriptionValidator.label("Description"),
  categoryId: number().required("Category is required"),
})
const CreatePostPage = ({userRole}) => {
  if (userRole !== "author") {
    return <div>Erreur : Accès réservé aux auteurs</div>
  }

  const handleSubmit = async (values, { resetForm }) => {
    await axios.post("http://localhost:3000/api/posts", values)
    resetForm()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField name="name" placeholder="Enter a name" />
        <FormField name="description" placeholder="Enter a description" />
        <FormField name="categoryId" placeholder="Enter a categoryID" />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 active:bg-blue-700 text-2xl text-white"
        >
          Submit
        </button>
      </Form>
    </Formik>
  )
}

export default CreatePostPage
