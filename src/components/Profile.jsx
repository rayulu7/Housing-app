import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

// Firebase Imports
import { db, collection, getDocs } from './firebase';
import { auth, signOut } from './firebase';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
       
        window.location.href = "/login";
        return;
      }

      console.log("Current user:", user); 

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
    });

    return () => unsubscribe(); 
  }, []);

  
  async function handleLogout() {
    try {
      await signOut(auth); 
      toast.success("Logged out successfully!");
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Failed to log out.");
    }
  }

  
  const filteredUsers = users
    .filter((user) =>
      user.fname.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (selectedGender) {
        return user.gender === selectedGender;
      }
      return true; 
    });

  return (
    <div className="profile-container">
      <header>
        <h1>housing.in</h1>
      </header>

      <div className="content-container">
        {/* Left Section: Filters */}
        <div className="filters">
          <h3>Filter by Gender</h3>

          <div className="gender-filter-box">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={selectedGender === 'male'}
                onChange={() => setSelectedGender('male')}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={() => setSelectedGender('female')}
              />
              Female
            </label>
          </div>
        </div>

        {/* Right Section: Search and Table */}
        <div className="table-section">
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* User Table */}
          {loading ? (
            <DotLottieReact
      src="https://lottie.host/b68051e4-e953-44b7-88d2-c97ccd5ad262/4maKY1pCnF.lottie"
      loop
      autoplay
    />
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
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      
    </div>
  );
};

export default Profile;