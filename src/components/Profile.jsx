import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

// Firebase Imports
import { db, collection, getDocs } from './firebase';
import { auth, signOut } from './firebase';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Track selected tags

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

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

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      if (tag === 'all') {
        return ['all'];
      }

      if (prev.includes('all')) {
        return [tag];
      }

      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const filteredUsers = users
    .filter((user) => {
      const fullName = `${user.fname} ${user.lname}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return fullName.startsWith(searchTermLower) ||  user.email?.toLowerCase().includes(searchTermLower);
    })
    .filter((user) => {
      if (selectedTags.includes('all') || selectedTags.length === 0) return true;
      return selectedTags.includes(user.gender?.toLowerCase());
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
                checked={selectedTags.includes('male')}
                onChange={() => toggleTag('male')}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedTags.includes('female')}
                onChange={() => toggleTag('female')}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="all"
                checked={selectedTags.includes('all')}
                onChange={() => toggleTag('all')}
              />
              All
            </label>
          </div>
        </div>

        {/* Right Section: Search and Table */}
        <div className="table-section">
          {/* Display applied filters as tags */}
          <div className="filter-tags">
            <span className="filter-applied">Filter applied</span>
            {selectedTags.map(tag => (
              <button key={tag} className="tag-button" onClick={() => removeTag(tag)}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                <span className="close-tag">&times;</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* User Table */}
          {loading ? (
            <div className="loader-container">
              <img src="/PageLoading.gif" alt="Loading table..." className="table-loader" />
            </div>
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