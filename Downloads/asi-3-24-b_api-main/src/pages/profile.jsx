import Loader from "@/web/components/ui/Loader"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React, { useState } from "react"
import jsonwebtoken from "jsonwebtoken"
import config from "@/config"

/*eslint-disable*/

export const getServerSideProps = async ({ req, query: { page } }) => {
  try {
    // Récupérer le rôle de l'utilisateur à partir du middleware auth
    const { payload } = jsonwebtoken.verify(
      req.cookies[config.security.jwt.cookieName],
      config.security.jwt.secret
    );
    const userid = payload ? payload.id : null;

    // Récupérer les données initiales
    const data = await apiClient("/users", { params: { page } });

    return {
      props: { initialData: data, userid, user: payload },
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return {
      redirect: {
        destination: '/sign-in', // Rediriger vers une page d'erreur spécifique
        permanent: false,
      },
    };
  }
};


const ProfilePage = ({ initialData, userid, user }) => {
  // Vérifier le rôle de l'utilisateur

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
  const [editedUser, setEditedUser] = useState(null);
  const [editedFields, setEditedFields] = useState({
    firstname: "",
    lastname: "",
    datebirth: "",
  });
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }));
  };
  const handleEditClick = (userId) => {
  if (userId === userid) {
    setEditedUser(userId);
    const userToEdit = users.find((user) => user.id === userId);
    setEditedFields({
      firstname: userToEdit.firstname,
      lastname: userToEdit.lastname,
      datebirth: userToEdit.datebirth,
    });
  } else {
    // Display an error message or handle unauthorized access
    console.log("Unauthorized access attempt", userid, user, userId);
  }
};
  const handleSaveEdit = async (userId) => {
    try {
      await apiClient.patch(`/users/${userId}`, editedFields);
      setEditedUser(null);
      setEditedFields({
        firstname: "",
        lastname: "",
        datebirth: "",
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
              "Firstname",
              "Lastname",
              "Date of Birth",
              "Email",
              "🖊️",
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
          {users
            .filter(({ id }) => id === userid) // Filtre pour n'inclure que l'utilisateur connecté
            .map(({ id, firstname, lastname, datebirth, email }) => {
              console.log("User ID:", id);
              console.log("UserID from cookie:", userid);
              return (
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
                    {userid === id && editedUser === id ? (
                      <button onClick={() => handleSaveEdit(id)}>Save</button>
                    ) : userid === id ? (
                      <button onClick={() => handleEditClick(id)}>Edit</button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePage;