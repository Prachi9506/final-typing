const words = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
];

let currentWordIndex = 0;
let startTime;
let isTyping = false;
let mistakes = 0;
let totalCharacters = 0;

const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

function getRandomWords(count) {
    const selectedWords = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randomIndex]);
    }
    return selectedWords;
}

function displayWords() {
    const wordsToShow = getRandomWords(10);
    textDisplay.innerHTML = wordsToShow
        .map((word, index) => `<span class="word ${index === 0 ? 'current' : ''}">${word}</span>`)
        .join(' ');
    currentWordIndex = 0;
}

function updateStats() {
    if (!startTime || !isTyping) return;

    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // in minutes
    const wordsTyped = currentWordIndex;
    const wpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = Math.round(((totalCharacters - mistakes) / totalCharacters) * 100);

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
}

function highlightKey(key) {
    const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 100);
    }
}

inputField.addEventListener('input', (e) => {
    if (!isTyping) {
        isTyping = true;
        startTime = new Date().getTime();
    }

    const currentWord = textDisplay.children[currentWordIndex];
    const typedValue = e.target.value;
    
    highlightKey(e.data || ' ');

    if (typedValue.endsWith(' ')) {
        const wordToCompare = currentWord.textContent;
        const typedWord = typedValue.trim();

        if (typedWord === wordToCompare) {
            currentWord.classList.add('correct');
        } else {
            currentWord.classList.add('incorrect');
            mistakes += Math.abs(wordToCompare.length - typedWord.length);
        }

        totalCharacters += wordToCompare.length + 1; // +1 for space
        currentWord.classList.remove('current');
        
        if (currentWordIndex < textDisplay.children.length - 1) {
            currentWordIndex++;
            textDisplay.children[currentWordIndex].classList.add('current');
        } else {
            displayWords();
        }

        e.target.value = '';
        updateStats();
    }
});

// Initialize
displayWords();
inputField.focus();

// Keep focus on input field
document.addEventListener('click', () => inputField.focus());