import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate=useNavigate()

  const [errorMessage, setErrorMessage] = useState(''); // Add state to display error message

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.status === 200) {
        const data = await response.json();
        setToken(data.token);
        setLoginSuccess(true);
        setErrorMessage('');
        navigate('/ToDo', { state: { token: data.token } }); // Pass the token to ToDo
    } else {
      // Handle login error
      setLoginSuccess(false);
      if (response.status === 400) {
        setErrorMessage('Incorrect username or password');
      } else {
        setErrorMessage('Login failed');
      }
    }
  };
  
  const handleRegister = async () => {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.status === 201) {
      // Registration was successful
      setErrorMessage(''); 
      setLoginSuccess(true);
    } else if (response.status === 400) {
      // Username already exists
      setErrorMessage('Username already exists. Please choose a different username.');
      setLoginSuccess(false);
    } else {
      // Handle other registration errors
      console.error('Registration failed');
      setErrorMessage('Registration failed.');
      setLoginSuccess(false);
    }
  };
  
  

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(''); 
    setLoginSuccess(false)
};

  return (
    <div className="login-container">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={isLogin ? handleLogin : handleRegister} className="login-button">
        {isLogin ? 'Login' : 'Register'}
      </button>
      {loginSuccess && <p className="success-message">Action successful!</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={handleToggleMode} className="toggle-button">
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};

export default Login;
