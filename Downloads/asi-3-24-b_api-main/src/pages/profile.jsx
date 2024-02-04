import Loader from "@/web/components/ui/Loader"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import jsonwebtoken from "jsonwebtoken"
import config from "@/config"

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
// eslint-disable-next-line max-lines-per-function
const ProfilePage = ({ initialData, userid, userRole }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const [editedUser, setEditedUser] = useState(null)
  const [editedFields, setEditedFields] = useState({
    firstname: "",
    lastname: "",
    datebirth: "",
  })
  const { isFetching, data: { result: users }, refetch } = useQuery({
    queryKey: ["users", page],
    queryFn: () => apiClient("/users", { params: { page } }),
    initialData,
    enabled: false,
  })

  useEffect(() => {
    if (userRole === "admin") {
      refetch()
    }
  }, [userRole, refetch])

  if (userRole === "admin") {
    return <div>Erreur : Accès réservé aux utilisateurs et auteurs</div>
  }

  const handleInputChange = (e, field) => {
    const { value } = e.target
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }))
  }
  const handleEditClick = (userId) => {
    const userToEdit = users.find(({ id }) => id === userid)
    
    if (userId === userid && userToEdit) {
      setEditedUser(userId)
      setEditedFields({
        firstname: userToEdit.firstname,
        lastname: userToEdit.lastname,
        datebirth: userToEdit.datebirth,
      })
    }
  }
  const handleSaveEdit = async (userId) => {
    await apiClient.patch(`/users/${userId}`, editedFields)
    setEditedUser(null)
    setEditedFields({
      firstname: "",
      lastname: "",
      datebirth: "",
    })
    await refetch()
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {["Firstname", "Lastname", "Date of Birth", "Email", "🖊️"].map((label) => (
              <td
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {users
            .filter(({ id }) => id === userid)
            .map(({ id, firstname, lastname, datebirth, email }) => (
              <tr key={id} className="even:bg-slate-100">
                <td className="p-4">
                  {editedUser === id ? (
                    <input
                      type="text"
                      value={editedFields.firstname}
                      onChange={(e) => handleInputChange(e, "firstname")}
                    />
                  ) : (
                    firstname
                  )}
                </td>
                <td className="p-4">
                  {editedUser === id ? (
                    <input
                      type="text"
                      value={editedFields.lastname}
                      onChange={(e) => handleInputChange(e, "lastname")}
                    />
                  ) : (
                    lastname
                  )}
                </td>
                <td className="p-4">
                  {editedUser === id ? (
                    <input
                      type="date"
                      value={editedFields.datebirth}
                      onChange={(e) => handleInputChange(e, "datebirth")}
                    />
                  ) : (
                    datebirth
                  )}
                </td>
                <td className="p-4">{email}</td>
                <td className="p-4">
                  {userid === id && editedUser === id && (
                    <button onClick={() => handleSaveEdit(id)}>Save</button>
                  )}
                  {userid === id && editedUser !== id && (
                    <button onClick={() => handleEditClick(id)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProfilePage
