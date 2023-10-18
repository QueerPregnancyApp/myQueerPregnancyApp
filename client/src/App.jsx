import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import MyJournal from "./components/MyJournal";
import StatesRights from "./components/StatesRights";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  // const App = () => {
  //   const [users, setUsers] = useState([]);
  //   const [selectedUser, setSelectedUser] = useState(null);
  //   const [newUser, setNewUser] = useState({ name: '', email: '' });

  //   // Fetch all users
  //   const getAllUsers = async () => {
  //     try {
  //       const response = await fetch('/api/users');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setUsers(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };

  //   // Fetch a single user by ID
  //   const getUserById = async (userId) => {
  //     try {
  //       const response = await fetch(`/api/users/${userId}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setSelectedUser(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   };

  //   // Create a new user
  //   const createUser = async () => {
  //     try {
  //       const response = await fetch('/api/users', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(newUser),
  //       });
  //       if (response.ok) {
  //         // Handle success, e.g., display a success message and reset the form.
  //         console.log('User created successfully');
  //         setNewUser({ name: '', email: '' });
  //       }
  //     } catch (error) {
  //       console.error('Error creating user:', error);
  //     }
  //   };

  //   // Update an existing user
  //   const updateUser = async (userId, updatedUser) => {
  //     try {
  //       const response = await fetch(`/api/users/${userId}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(updatedUser),
  //       });
  //       if (response.ok) {
  //         // Handle success, e.g., display a success message.
  //         console.log('User updated successfully');
  //       }
  //     } catch (error) {
  //       console.error('Error updating user:', error);
  //     }
  //   };

  //   // Delete a user
  //   const deleteUser = async (userId) => {
  //     try {
  //       const response = await fetch(`/api/users/${userId}`, {
  //         method: 'DELETE',
  //       });
  //       if (response.ok) {
  //         // Handle success, e.g., remove the user from the list and clear the selected user.
  //         console.log('User deleted successfully');
  //         setUsers(users.filter((user) => user.id !== userId));
  //         setSelectedUser(null);
  //       }
  //     } catch (error) {
  //       console.error('Error deleting user:', error);
  //     }
  //   };

  //   useEffect(() => {
  //     getAllUsers();
  //   }, []);

  //   return (
  //     <div>
  //       {/* Your JSX here to display users, user details, create/update forms, and buttons to trigger the functions */}
  //     </div>
  //   );
  // };

  // export default App;

  //check to see if the token is there or not
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const getUser = async () => {
  //     const response = await fetch("/api/auth/me", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: token,
  //       },
  //     });
  //     const data = await response.json();

  //     if (data.ok) {
  //       setUser(data.user);
  //     }
  //   };

  //   if (token) {
  //     getUser();
  //   }
  // }, []);
  // console.log(user);

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      {user ? (
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/journal"
            element={<MyJournal user={user} setUser={setUser} />}
          />
          <Route path="/states-rights" element={<StatesRights />} />{" "}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LoginForm setUser={setUser} />} />
          <Route
            path="/register"
            element={<RegisterForm setUser={setUser} />}
          />
        </Routes>
      )}
    </>
  );
}

export default App;
