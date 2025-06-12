import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

// Firebase Imports
import { db, collection, getDocs } from './firebase';
import { auth, signOut } from './firebase';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        toast.success("Users loaded successfully!");
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  async function handleLogout() {
  try {
    await signOut(auth); // Log out the user
    toast.success("Logged out successfully!");
    window.location.href = "/login"; // Redirect to login page
  } catch (error) {
    console.error("Logout error:", error.message);
    toast.error("Failed to log out.");
  }
}

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
    <div className="user-profile-container">
      {/* Header */}
      <header>
        <h1>housing.in</h1>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loader or Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Residential Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fname} {user.lname}</td>
                    <td>{user.dob || "-"}</td>
                    <td>{user.gender || "-"}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      {user.address?.address}, {user.address?.state}, {user.address?.pin}, {user.address?.country}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Logout Button */}
      <button className="logout-btn" onClick = {handleLogout}>Logout</button>

      
     
    </div>
     
  );
};

export default Profile;