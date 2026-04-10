


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, createRoutesFromChildren } from 'react-router-dom';
import './App.css'; // You'll need to create this CSS file

// Placeholder images (replace with your actual image paths)
const kitten1 = 'https://placekitten.com/200/280'; // Example URL
const puppy1 = 'https://placedog.net/200/280';    // Example URL
const dog1 = 'https://placedog.net/200/290';      // Example URL
const kitten2 = 'https://placekitten.com/200/290'; // Example URL
const puppy2 = 'https://placedog.net/200/295';    // Example URL
const dog2 = 'https://placedog.net/200/300';      // Example URL

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Pawkiesss</h1>
        <div className="auth-buttons">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </header>

      <section className="hero-section">
        <h2>Your Pet's Home Away From Home</h2>
        <p>
          When work keeps you busy, Pawkiesss provides loving and reliable pet
          babysitting services. Your furry friends will be in safe and caring
          hands.
        </p>
      </section>

      <section className="gallery-section">
        <h2>Our Happy Guests</h2>
        <div className="image-grid">
          <img src={kitten1} alt="Cute Kitten" />
          <img src={puppy1} alt="Cute Puppy" />
          <img src={dog1} alt="Happy Dog" />
          <img src={kitten2} alt="Another Cute Kitten" />
          <img src={puppy2} alt="Another Cute Puppy" />
          <img src={dog2} alt="Another Happy Dog" />
        </div>
      </section>

      <section className="services-section">
        <h2>Why Choose Pawkiesss?</h2>
        <ul>
          <li>Experienced and caring pet sitters</li>
          <li>Safe and comfortable environment</li>
          <li>Personalized attention for your pet</li>
          <li>Regular updates and photos</li>
          <li>Flexible scheduling options</li>
        </ul>
      </section>

      <footer>
        <p>&copy; 2025 Pawkiesss. All rights reserved.</p>
        <p>Contact: Yash Dubey 8369176325</p>
      </footer>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you'd handle authentication here.
    console.log('Login submitted:', { email, password });
    alert('Simulating login.  Please implement real authentication.');
  };

  return (
    <div className="login-page">
      <header>
        <h1>Login to Pawkiesss</h1>
        <Link to="/">Go Back Home</Link>
      </header>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you'd handle registration here.
        console.log("Signup form", {name, email, password, confirmPassword});
        alert('Simulating sign up.  Please implement actual user creation.');
    }

  return (
    <div className="signup-page">
      <header>
        <h1>Sign Up for Pawkiesss</h1>
        <Link to="/">Go Back Home</Link>
      </header>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 
 




