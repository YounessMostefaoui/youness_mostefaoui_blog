import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React, { useState } from "react"
import jsonwebtoken from "jsonwebtoken"
import config from "@/config"

/*eslint-disable*/

export const getServerSideProps = async ({ query: { page }, req }) => {
  // Récupérer le rôle de l'utilisateur à partir du middleware auth
  const { payload } = jsonwebtoken.verify(
    req.cookies[config.security.jwt.cookieName],
    config.security.jwt.secret,
  )
  const userRole = payload ? payload.role : null;
  // Récupérer les données initiales
  const data = await apiClient("/users", { params: { page } });

  return {
    props: { initialData: data, userRole },
  }
}
const AdminPage = ({ initialData, userRole }) => {
  // Vérifier le rôle de l'utilisateur
  if (userRole !== "admin") {
    return <div>Erreur : Accès réservé aux administrateurs</div>;
  }

  const { query } = useRouter();
  const page = Number.parseInt(query.page || 1, 10);
  const {
    isFetching,
    data: { result: users, meta: { count } },
    refetch,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => apiClient("/users", { params: { page } }),
    initialData,
    enabled: false,
  });
  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: async (userId) => {
      try {
        const deletedUser = await apiClient.delete(`/users/${userId}`);
        return deletedUser;
      } catch (error) {
        throw new Error("Error deleting user");
      }
    },
  });
  const handleClickDelete = async (event) => {
    try {
      const userId = Number.parseInt(event.target.getAttribute("data-id"), 10);

      if (!isNaN(userId)) {
        await deleteUser(userId);
        await refetch();
      } else {
        // Handle the case where userId is not a valid number
      }
    } catch (error) {
      // Handle any unexpected errors during deletion
      console.error("Error deleting user:", error);
    }
  };
  const [editedUser, setEditedUser] = useState(null);
  const [editedFields, setEditedFields] = useState({
    firstname: "",
    lastname: "",
    datebirth: "",
    activate: "",
  });
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }));
  };
  const handleEditClick = (userId) => {
    setEditedUser(userId);
    const userToEdit = users.find((user) => user.id === userId);
    setEditedFields({
      firstname: userToEdit.firstname,
      lastname: userToEdit.lastname,
      datebirth: userToEdit.datebirth,
      activate: userToEdit.activate,
    });
  };
  const { mutateAsync: toggleActivate } = useMutation({
    mutationFn: (user) =>
      apiClient.patch(`/users/${user.id}`, {
        activate: !user.activate,
      }),
  });
  const handleClickToggle = (id) => async () => {
    const user = users.find(({ id: userId }) => userId === id);
    await toggleActivate(user);
    await refetch();
  };
  const handleSaveEdit = async (userId) => {
    try {
      await apiClient.patch(`/users/${userId}`, editedFields);
      setEditedUser(null);
      setEditedFields({
        firstname: "",
        lastname: "",
        datebirth: "",
        activate: "",
      });
      await refetch();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {[
              "#",
              "Firstname",
              "Lastname",
              "Date of Birth",
              "Email",
              "Role",
              "Activate",
              " ",
              "🖊️",
              "🗑️",
            ].map((label) => (
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
          {users.map(
            ({ id, firstname, lastname, datebirth, email, role, activate }) => (
              <tr key={id} className="even:bg-slate-100">
                <td className="p-4">{id}</td>
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
                <td className="p-4">{role}</td>
                <td className="p-4">{activate ? "✔" : "✖"}</td>
                <td className="p-4">
                  <button onClick={handleClickToggle(id)}>Toggle</button>
                </td>
                <td className="p-4">
                  {editedUser === id ? (
                    <button onClick={() => handleSaveEdit(id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(id)}>Edit</button>
                  )}
                </td>
                <td className="p-4">
                  <button data-id={id} onClick={handleClickDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default AdminPage
