import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './Components/AuthForm'; 
import ToDo from './Components/ToDo'; 

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/ToDo" element={<ToDo />} />
    </Routes>
  </Router>
  );
}

export default App;
