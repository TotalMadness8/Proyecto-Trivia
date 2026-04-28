import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Axios } from 'axios';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Test test
        </p>
        <a className="App-link"
        >
         <button className="counter" onClick={() => {
    window.location.href = 'https://presencial.ucc.edu.ar/login/index.php';
  }}>Logueate campeón</button>   
        </a>
      </header>
    </div>
  );
}

export default App;
