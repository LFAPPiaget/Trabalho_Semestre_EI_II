import React, { useState } from 'react';
import './App.css';


export const checkForWord = (inputText, targetWord) => {
  const wordExists = new RegExp(`\\b${targetWord}\\b`, 'i').test(inputText);

  if (wordExists) {
    return `The word '${targetWord}' exists in the text.`;
  } else {
    return `The word '${targetWord}' does not exist in the text.`;
  }
};

function App() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');

  const processText = () => {
    // Specify the word you want to check for
    const targetWord = 'PE000';

    // Check if the target word exists in the input text (case-insensitive)
    const wordExists = new RegExp(`\\b${targetWord}\\b`, 'i').test(inputText);

    if (wordExists) {
      setResultText(`The word '${targetWord}' exists in the text.`);
    } else {
      setResultText(`The word '${targetWord}' does not exist in the text.`);
    }
  };

  return (
    <div className="App">
      <h1>TESTE DE VALIDAÇÃO DE TEXTO</h1>
      <textarea
        placeholder="Insira o texto..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={processText}>Verificar Palavra</button>
      <br />
      <label>Result:</label>
      <div>{resultText}</div>
    </div>
  );
}

export default App;
