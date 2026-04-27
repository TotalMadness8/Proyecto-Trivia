import { useState, useEffect } from 'React';
import { axios } from 'axios';


//Constantes para la API de trivia
export function getTrivia() {
    const [preguntaTrivia, setPreguntaTrivia] = useState([]);
    const [respuestaCorrecta, setRespuestaCorrecta] = useState("");
    const [puntos, setPuntos] = useState(0);
    const [todasLasRespuestas, setTodasLasRespuestas] = useState([]);
    const [loading, setloading] = useState(false);
}

//Llamada a la API usando axios
export async function getTriviaData() {
    setloading(true);
    try {
        const response = await axios.get('https://opentdb.com/api_config.php');
        if (!response.ok) throw new Error('Error al obtener los datos de la API de trivia');

        setPreguntaTrivia(response.data.results);
        setRespuestaCorrecta(response.data.results[0].correct_answer);
    } 
    catch (error) {
        console.error('Error al obtener los datos de la API de trivia:', error);
    } 
    finally {
        setloading(false);
    }
}

//Meto todas las respuestas a un solo array
export async function combinarRespuestas(respuestasIncorrectas, respuestaCorrecta) {
    let respuestasCombinadas = [];
    respuestasIncorrectas.map((item) => {
        item.incorrect_answers.map((respuestaIncorrecta) => {
            respuestasCombinadas.push(respuestaIncorrecta)
        });
    });
    respuestasCombinadas.push(respuestaCorrecta);
    respuestasCombinadas.sort(() => Math.random() - 0.5);
    setTodasLasRespuestas(respuestasCombinadas);
}