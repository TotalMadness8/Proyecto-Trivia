import React, { useState, useEffect } from 'react';
import './App.css';
import { API_DIFICULTAD } from './config.js';
import { triviaService } from './services.js';

function App() {
  // Estados
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Controladores para las pantallas: 'MENU', 'QUIZ', 'SCORE'
  const [gameState, setGameState] = useState('MENU');
  
  const [selection, setSelection] = useState({
    category: '',
    difficulty: 'easy'
  });

  // Efectos
  
  // 1. Busca las categorias
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await triviaService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Combina y mezcla las preguntas cada vez que cambia la pregunta
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      const current = questions[currentQuestionIndex];
      const allOptions = [...current.incorrect_answers, current.correct_answer]
        .sort(() => Math.random() - 0.5);
      setShuffledOptions(allOptions);
      setSelectedAnswer(null); 
    }
  }, [questions, currentQuestionIndex]);

  // Manejo de los datos del usuario y lógica del juego

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection(prev => ({ ...prev, [name]: value }));
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const data = await triviaService.getQuestions(selection.category, selection.difficulty);
      setQuestions(data);
      setScore(0);
      setCurrentQuestionIndex(0);
      setGameState('QUIZ'); // <-- Pasa a la pantalla de preguntas
    } catch (error) {
      alert("Error al cargar las preguntas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return; 

    if (option === questions[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
    setSelectedAnswer(option);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('SCORE');
    }
  };
    // Resetea todo y vuelve al menu
  const resetToMenu = () => {
    setGameState('MENU');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  const getButtonClass = (option) => {
    if (!selectedAnswer) return "option-button";
    const current = questions[currentQuestionIndex];
    if (option === current.correct_answer) return "option-button correct"; 
    if (option === selectedAnswer) return "option-button incorrect"; 
    return "option-button disabled";
  };

  // Renderizado de la app
  return (
    <div className="App">
      <header className="App-header">
        <h1>Trivia!</h1>

        {loading && gameState === 'MENU' && <p>Cargando configuración...</p>}

        {/* Pantalla 1, configuración del usuario */}
        {!loading && gameState === 'MENU' && (
          <div className="menu-container">

            {/* Selector de categoria */}
            <select name="category" className="counter" onChange={handleChange} value={selection.category}>
              <option value="">Selecciona Categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Selector de dificultad*/}
            <select name="difficulty" className="counter" onChange={handleChange} value={selection.difficulty}>
              {API_DIFICULTAD.map((dif) => (
                <option key={dif.id} value={dif.value}>{dif.name}</option>
              ))}
            </select>

            {/* Boton de inicio */}
            <button 
              className="counter" 
              onClick={startGame}
              disabled={!selection.category}
            >
              Empezar Juego
            </button>
          </div>
        )}

        {/* Pantalla 2 - Preguntas y respuestas */}
        {gameState === 'QUIZ' && questions.length > 0 && (
          <div className="quiz-container">
            <p className="accent-text">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
            
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

            {/* Botones de navegación */}
            <button 
              onClick={nextQuestion} 
              className="counter next-btn" 
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Puntaje Final'}
            </button>

            {/* Boton para volver al menu */}
            <button onClick={resetToMenu} className="back-link">
              Abandonar y Volver al Menú
            </button>
          </div>
        )}

        {/* Pantalla 3 - Resultados */}
        {gameState === 'SCORE' && (
          <div className="results-container">
            <h2>Partida Terminada!</h2>
            <p>Le pegaste a {score} de {questions.length} preguntas.</p>
            
            <button onClick={resetToMenu} className="counter">
              Volver al Menú Principal
            </button>
          </div>
        )}

      </header>
    </div>
  );
}

export default App;