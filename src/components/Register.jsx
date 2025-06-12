import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowDropright, IoIosArrowDropleft } from 'react-icons/io';
import './Register.css';

// Firebase imports
import { auth, db, createUserWithEmailAndPassword, collection, addDoc } from './firebase';
import { useNavigate } from 'react-router-dom'; // ✅ Add this for navigation

const Register = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [locality, setLocality] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const navigate = useNavigate(); // ✅ Hook for redirection

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!fname || !lname || !email || !password || !confirmPassword || !gender || !day || !month || !year) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      // Step 1: Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Save additional user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        fname,
        lname,
        email,
        gender,
        dob: `${day}/${month}/${year}`,
        phone: `${phoneCode}${phoneNumber}`,
        address: {
          country,
          address,
          state,
          pin,
          locality,
        },
        createdAt: new Date(),
      });

      // ✅ Show success message and redirect after delay
      toast.success('Registration successful!', {
        position: 'top-center',
        autoClose: 3000,
        onClose: () => navigate('/profile'),
      });

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong. Please try again.', {
        position: 'bottom-center',
      });
    }
  };

  return (
    <>
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="register-container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">housing.in</h1>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Left Section */}
          <div className="left-section">
            <div className="image-card">
              <img src="/image.png" alt="Housing Platform" />
            </div>
            <div className="description-card">
              <p className="description">
                Housing.in is India's most innovative real estate advertising platform for homeowners, landlords, developers, and real estate brokers.
                The company offers listings for new homes, resale homes, rentals, plots, and co-living spaces in India.
              </p>
            </div>
          </div>

          {/* Right Section: Registration Form */}
          <div className="right-section">
            <h2>Create Account</h2>

            {/* Name - First Name & Surname */}
            <div className="form-row">
              <label className="form-label">Name</label>
              <div className="input-group">
                <input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
                <input type="text" placeholder="Surname" value={lname} onChange={(e) => setLname(e.target.value)} required />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-row">
              <label className="form-label">Date of Birth</label>
              <div className="input-group dob-fields">
                <input type="number" placeholder="DD" maxLength="2" value={day} onChange={(e) => setDay(e.target.value)} required />
                <input type="number" placeholder="MM" maxLength="2" value={month} onChange={(e) => setMonth(e.target.value)} required />
                <input type="number" placeholder="YYYY" maxLength="4" value={year} onChange={(e) => setYear(e.target.value)} required />
              </div>
            </div>

            {/* Gender */}
            <div className="form-row">
              <label className="form-label">Gender</label>
              <div className="input-group gender-fields">
                <label>
                  <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} required /> Male
                </label>
                <label>
                  <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} /> Female
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="form-row">
              <label className="form-label">Email</label>
              <div className="input-group">
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* Phone */}
            <div className="form-row">
              <label className="form-label">Phone</label>
              <div className="input-group phone-fields">
                <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                </select>
                <input type="tel" placeholder="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>

            {/* Address */}
            <div className="form-row">
              <label className="form-label">Residential Address</label>
              <div className="address-grid">
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="">Country</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
                <input type="text" placeholder="Apartment and Street Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="">State</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                </select>
                <input type="text" placeholder="Pin" value={pin} onChange={(e) => setPin(e.target.value)} />
                <input type="text" placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} />
              </div>
            </div>

            {/* Password */}
            <div className="form-row">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
          </div>
        </main>

        {/* Navigation Arrows */}
        <div className="navigation-arrows">
          <button type="button" className="arrow-btn left-arrow" disabled>
            <IoIosArrowDropleft size={40} />
          </button>
          <button type="submit" className="arrow-btn right-arrow">
            <IoIosArrowDropright size={40} />
          </button>
        </div>
      </div>
    </form>

    <ToastContainer />
    </>
  );
};

export default Register;