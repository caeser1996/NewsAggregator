import React, { useState } from 'react';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send login request to API
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      props.onLogin();
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;
