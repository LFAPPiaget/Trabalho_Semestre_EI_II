// App.test.js
import { checkForWord } from './App';

test('checkForWord should correctly determine word existence', () => {
  // Arrange
  const inputText = 'This is an Example text.';
  const targetWord = 'example';


  // Act
  const resultExists = checkForWord(inputText, targetWord);
  const resultNotExists = checkForWord(inputText, 'nonexistent');

  // Assert
  expect(resultExists).toBe(`The word 'example' exists in the text.`);
  expect(resultNotExists).toBe(`The word 'nonexistent' does not exist in the text.`);
});
