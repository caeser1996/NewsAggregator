import { useState } from 'react';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Send signup request to API
        fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Signup failed');
                }
            })
            .then(data => {
                console.log('Signup successful');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
            <p>Already have an account? <a href="/">Log in</a></p>
        </div>
    );
}

export default Signup;
