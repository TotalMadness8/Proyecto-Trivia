import logo from './logo.svg';
import './App.css';
import {API_DIFICULTAD} from './config'

const handlerDificultad = (event) => {
  console.log(event.target.value)
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Trivia
        </p>
        <a className="App-link">
         <select 
          className="counter"
          onChange={handlerDificultad}
         >
          {API_DIFICULTAD.map((dificultad) => {
            return (
              <option key={dificultad.id} value={dificultad.value}>
                {dificultad.name}
              </option>
            );
          })}
          </select>   
        </a>
      </header>
    </div>
  );
}

export default App;
