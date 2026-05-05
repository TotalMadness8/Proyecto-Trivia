import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { API_CATEGORIAS, API_DIFICULTAD, API_CANTIDAD } from './config';




function App() {
  // Manejos de estado, todas las constantes de la API
  const [categories, setCategories] = useState([]);
  //Set de preguntas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  //Opción seleccionada
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  //Array para mezclar las opciónes
  const [shuffledOptions, setShuffledOptions] = useState([]);
  //Setea la dificultad y la categoria
  const [selection, setSelection] = useState({

    category: '',
    difficulty: 'easy'

  });
  //Crea las preguntas
  const [questions, setQuestions] = useState([]);
  //Inicia el juego
  const [gameStarted, setGameStarted] = useState(false);
  //Checkea que la API no este cargando
  const [loading, setLoading] = useState(false);
  //Muestra los resultados al final
  const [showResults, setShowResults] = useState(false);
  //Lleva la cuenta del jugador en el background
  const [score, setScore] = useState(0);



  // 1. Busca las categorias 
  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const response = await axios.get(API_CATEGORIAS);

        setCategories(response.data.trivia_categories);

      } catch (error) {

        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {

    // Combino todas las respuestas en un solo Array y las mezcla
  if (questions.length > 0) {
    
    const current = questions[currentQuestionIndex];

    const allOptions = [...current.incorrect_answers, current.correct_answer]

      .sort(() => Math.random() - 0.5);

    setShuffledOptions(allOptions);

    setSelectedAnswer(null); // <-- Resetea para la proxima pregunta
  }
}, [questions, currentQuestionIndex]);


  //Maneja los cambios de valores
  const handleChange = (e) => {

    const { name, value } = e.target;

    setSelection(prev => ({ ...prev, [name]: value }));

  };



  //Inicio de la partida (busca 5 preguntas según la categoria y la dificultad)

  const startGame = async () => {
    setLoading(true);

  try {
    const url = `https://opentdb.com/api.php?amount=${API_CANTIDAD}&category=${selection.category}&difficulty=${selection.difficulty}&type=multiple`;
    const response = await axios.get(url);
    
    if (response.data.response_code === 0) {
      setQuestions(response.data.results);
      setGameStarted(true);
      setCurrentQuestionIndex(0);
    } else {
      alert("No hay preguntas para esta combinación, Prueba con otra categoria!");
    }
  } catch (error) {
    console.error("API Error:", error);
  } finally {
    setLoading(false);
  }
   console.log(selection.difficulty)
};


  // Feedback según la respuesta
const getButtonClass = (option) => {
  if (!selectedAnswer) return "option-button";
  
  const current = questions[currentQuestionIndex];
  if (option === current.correct_answer) return "option-button correct"; // <-- Verde
  if (option === selectedAnswer && option !== current.correct_answer) return "option-button incorrect"; // <-- Rojo
  
  return "option-button disabled";
};


// Maneja los clicks del usuario
  const handleAnswerClick = (option) => {

    // Evita que el usuario vuelva a clickear si ya dió una opción
    if (selectedAnswer) return; 

    // Lleva cuenta del puntaje
    if (option === questions[currentQuestionIndex].correct_answer) {
    setScore(prev => prev + 1);
  }
    
    // Esto guarda lo que el usuario eligió para que las clases de CSS puedan cambiar de color
    setSelectedAnswer(option);
  };


  //Manejo de las preguntas
const nextQuestion = () => {

    if (currentQuestionIndex < questions.length - 1) {
      
      //Esto vuelve a mezclar las respuestas (me estaba tirando error por exceso de pedidos a la API, esto me lo refactorizó todo el copilot, fui pecador)
      setCurrentQuestionIndex(prev => prev + 1);
      
    } else {
      // Si es la ultima pregunta, muestra los resultados
      setShowResults(true);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Trivia!</h1>

        {!gameStarted ? (

          <div className="menu-container">
            
            {/* Selección de categoria */}
            <select name="category" className="counter" onChange={handleChange}>

              <option value="">Selecciona Categoría</option>

              {categories.map((cat) => (

                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Selección de dificultad */}
            <select name="difficulty" className="counter" onChange={handleChange} value={selection.difficulty}>

              {API_DIFICULTAD.map((dif) => (

                <option key={dif.id} value={dif.value}>{dif.name}</option>

              ))}
            </select>

            <button 
              className="counter" 
              onClick={startGame}
              disabled={!selection.category || loading}
            >
              {loading ? 'Cargando...' : 'Empezar Juego'}
            </button>
          </div>
        ) : showResults ? (
        /*Resultados*/
        <div className="results-container">

          <h2>Partida Terminada!</h2>

          <p>Le pegaste a {score} de {questions.length} preguntas.</p>

          <button onClick={() => {
             /*Cierra el programa y lo vuelve a cero para volver a jugar*/    
            setGameStarted(false);
            setShowResults(false);
            setScore(0);

          }} className="counter">

            Jugar de Nuevo!
            </button>
        </div>
      ) : (
        gameStarted && questions.length > 0 ? (

  <div className="quiz-container">

    {/* Contador de preguntas, para saber donde estoy*/}
    <p style={{color: '#d6cfa6'}}>Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
    
    <h2 dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex]?.question }} />
    
    <div className="options-grid">

      {shuffledOptions.map((option, index) => (

        <button

          key={index}
          className={getButtonClass(option)}
          onClick={() => handleAnswerClick(option)}
          dangerouslySetInnerHTML={{ __html: option }}

        />
      ))}
    </div>

    {selectedAnswer && (

     <button 
    onClick={nextQuestion} 
    className="counter next-btn" 
    disabled={!selectedAnswer} // It's disabled if NO answer is selected
    style={{ marginTop: '40px' }}
  >
    {currentQuestionIndex < questions.length - 1 ? 'Siguiente' : 'Ver Resultados'}
  </button>
    )}

  <button onClick={() => setGameStarted(false)} className="back-link">

    Volver al Menú

  </button>
  
  </div>

) : loading ? (

  <p>Cargando preguntas...</p>

) : null)

 }
      </header>
    </div>
  );
}

export default App;
