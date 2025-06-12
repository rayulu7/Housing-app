import React, { useState } from 'react';
import './Login.css'; // External CSS
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logging in with:", { email, password });
      toast.success("User logged in successfully!", { position: "top-center" });

      // Redirect to profile after successful login
      window.location.href = "/profile";
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handleCreateNew = () => {
    // Navigate to Register page
    window.location.href = "/register";
  };

  return (
    <div className="login-container">
      <h1 className="heading">housing.in</h1>
      <form className="login-form" onSubmit={handleLogin}>
        {/* Email Field */}
        <div className="form-group">
          <input
            type="text"
            id="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button type="submit" className="login-button">Login</button>

        {/* Forgotten Password Link */}
        <p className="signup-link">
          <a href="/register">Forgotten Password?</a>
        </p>

        {/* Create New Account Button */}
        <button
          type="button"
          className="create-button"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </form>
    </div>
  );
};

export default Login;