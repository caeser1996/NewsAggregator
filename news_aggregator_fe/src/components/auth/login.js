import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Outernavbar from '../navbar/Navbar';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  function onChangeUserEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();

    const userObject = {
      email,
      password
    };

    axios.post('http://127.0.0.1:8000/api/auth/login', userObject)
      .then(res => {
        if (res.status === 200) {
          setLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/dashboard');
        }
      })
      .catch(error => {
        console.log(error);
        alert('Wrong email or password');
      });

    setEmail('');
    setPassword('');
  }

  if (loggedIn) {
    navigate('/dashboard');
  }

  return (
    <div className="container">
      <div className="App">
        <Outernavbar />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={onSubmit}>
              <h3>Sign In</h3>
              <p className="forgot-password text-right">
                Don't have account <a href="/sign-up">join us?</a>
              </p>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={onChangeUserEmail}
                  name="email"
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={onChangePassword}
                  name="password"
                  value={password}
                />
              </div>
              <div className="mb-3">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                  />
                  <label className="custom-control-label" htmlFor="customCheck1">
                    Remember me
                  </label>
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
