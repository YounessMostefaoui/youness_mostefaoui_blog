// // AuthContext.js
// /*eslint-disable*/
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import apiClient from '@/web/services/apiClient'; // Assurez-vous d'importer correctement votre client API

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await apiClient('/users');
//         setUser(response.data);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
