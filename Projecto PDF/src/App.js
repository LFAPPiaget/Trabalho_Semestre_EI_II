import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as pdfjs from 'pdfjs-dist';

await import('pdfjs-dist/build/pdf.worker.mjs')

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const App = () => {
  const [file, setFile] = useState(null);
  const [matchedText, setMatchedText] = useState('');
  const [docType, setDocType] = useState('');
  const [location, setLocation] = useState('');
  const [erro, setErro] = useState(0);

  // Mapeamento de códigos iniciais para locais
  const codeToTypeMap = {
    PE: 'Fatura',
    // Adicione mais mapeamentos conforme necessário
  };

  const codeToLocationMap = {
    '000714': 'Tribunal Judicial da Comarca de Lisboa Oeste',
    // Adicione mais mapeamentos conforme necessário
  };

  const handleFileChange = useCallback(async (uploadedFile) => {
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const pdfData = new Uint8Array(event.target.result);

        try {
          const pdfDoc = await pdfjs.getDocument(pdfData).promise;

          let text = '';
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const pdfPage = await pdfDoc.getPage(pageNum);
            const textContent = await pdfPage.getTextContent();
            text += textContent.items.map((item) => item.str).join(' ');
          }

          // Verificar se a string contém o padrão desejado usando regex
          const pattern = /([A-Z]{2}\d{13})/g;
          const match = text.match(pattern);

          if (match) {
            setMatchedText(match[0]);

            // Obter o tipo de documento com base nos caracteres iniciais
            const docPrefix = match[0].substr(0, 2); // Obter os primeiros 6 caracteres
            const docTypeRes = codeToTypeMap[docPrefix];
            setDocType(docTypeRes || 'Tipo de Documento desconhecido');

            // Obter a localização correspondente com base nos caracteres iniciais
            const codePrefix = match[0].substr(2, 6).toString(); // Obter os primeiros 6 caracteres
            const location = codeToLocationMap[codePrefix];

            setLocation(location || 'Localização desconhecida');
          } else {
            setMatchedText('Nenhuma correspondência encontrada.');
            setLocation('Nenhuma correspondência encontrada.');
            setDocType('Nenhuma correspondência encontrada.');
          }
          setErro(false);
        } catch (error) {
          setErro(true);
          alert('O arquivo carregado não é um arquivo PDF.');
        }
      };

      reader.readAsArrayBuffer(uploadedFile);
    } else {
      alert('Por favor, carregue um arquivo PDF.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    handleFileChange(uploadedFile);
  }, [handleFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (    
    <div className="container mt-5">
    <h1>Teste de PDF</h1>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>Arraste e solte um arquivo PDF aqui ou clique para selecionar.</p>
      </div>
      {(file && erro === false) &&
        <div style={{marginTop:'30px'}}>
          <h3>Resultado:</h3>
          <p>Arquivo carregado: <strong>{file.name}</strong></p>
          <p>Número de Documento: <strong>{matchedText}</strong></p>
          <p>Tipo de Documento: <strong>{docType}</strong></p>
          <p>Comarca do Documento: <strong>{location}</strong></p>
        </div>
      }
    </div>
  );
};

export default App;
