import axios from 'axios';
import { API_BASE, API_CATEGORIAS, API_CANTIDAD, API_TIPO } from './config';

export const triviaService = {
  // Busca las categorias disponibles
  getCategories: async () => {
    try {
      const response = await axios.get(API_CATEGORIAS);
      return response.data.trivia_categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Busca las categorias segun la elección del usuario
  getQuestions: async (category, difficulty) => {
    try {
      // Variables centralizadas de configuración
      const url = `${API_BASE}?amount=${API_CANTIDAD}&category=${category}&difficulty=${difficulty}&type=${API_TIPO}`;
      const response = await axios.get(url);
      
      if (response.data.response_code === 0) {
        return response.data.results;
      } else {
        throw new Error("No questions found for this combination.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  }
};