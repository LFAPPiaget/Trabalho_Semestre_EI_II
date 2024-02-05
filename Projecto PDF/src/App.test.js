import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('Renderiza o componente App corretamente', () => {
  render(<App />);
  
  // Verifica se o componente é renderizado corretamente
  expect(screen.getByText('Teste de PDF')).toBeInTheDocument();
  expect(screen.getByText('Arraste e solte um arquivo PDF aqui ou clique para selecionar.')).toBeInTheDocument();
});

test('Processa o arquivo PDF corretamente', async () => {
  const { getByText } = render(<App />);
  
  const file = new File(['pdf content'], 'example.pdf', { type: 'application/pdf' });

  const dropzone = getByText('Arraste e solte um arquivo PDF aqui ou clique para selecionar.');
  fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

  await waitFor(() => {
    // Verifica se o resultado é exibido corretamente
    expect(screen.getByText('Resultado:')).toBeInTheDocument();
    expect(screen.getByText(`Arquivo carregado: example.pdf`)).toBeInTheDocument();
    expect(screen.getByText('Número de Documento:')).toBeInTheDocument();
    // Adicione mais verificações conforme necessário
  });
});