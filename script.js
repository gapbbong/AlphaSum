document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('resultContainer');
    const calculationSteps = document.getElementById('calculationSteps');
    const finalScore = document.getElementById('finalScore');

    // Letter to number mapping
    const getLetterScore = (char) => {
        const code = char.toLowerCase().charCodeAt(0);
        if (code >= 97 && code <= 122) { // a-z
            return code - 96;
        }
        return 0; // Ignore non-alphabet
    };

    const validateInput = (text) => {
        // Allow only alphabets (both upper and lower)
        return /^[a-zA-Z]+$/.test(text);
    };

    const calculateScore = () => {
        const word = wordInput.value.trim();

        if (word === '') {
            errorMessage.textContent = 'Please enter a word.';
            errorMessage.classList.add('visible');
            resultContainer.classList.add('hidden');
            return;
        }

        if (!validateInput(word)) {
            errorMessage.textContent = 'Only English letters (A-Z, a-z) are allowed.';
            errorMessage.classList.add('visible');
            resultContainer.classList.add('hidden');
            return;
        }

        errorMessage.classList.remove('visible');
        
        // Reset and show container
        calculationSteps.innerHTML = '';
        finalScore.textContent = '0';
        resultContainer.classList.remove('hidden');

        let total = 0;
        const letters = word.split('');

        // Build calculation steps with staggered animations
        letters.forEach((char, index) => {
            const score = getLetterScore(char);
            total += score;

            // Create step element: A(1)
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            stepItem.style.animationDelay = `${index * 0.15}s`;

            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;

            const valueSpan = document.createElement('span');
            valueSpan.className = 'value';
            valueSpan.textContent = `(${score})`;

            stepItem.appendChild(letterSpan);
            stepItem.appendChild(valueSpan);
            calculationSteps.appendChild(stepItem);

            // Add '+' sign if not the last letter
            if (index < letters.length - 1) {
                const plusSign = document.createElement('span');
                plusSign.className = 'step-item operator';
                plusSign.textContent = '+';
                plusSign.style.animationDelay = `${(index * 0.15) + 0.07}s`;
                calculationSteps.appendChild(plusSign);
            }
        });

        // Add '=' sign at the end
        const equalsSign = document.createElement('span');
        equalsSign.className = 'step-item operator';
        equalsSign.textContent = '=';
        equalsSign.style.animationDelay = `${(letters.length - 1 + 0.5) * 0.15}s`;
        calculationSteps.appendChild(equalsSign);

        // Animate final total after all letters
        setTimeout(() => {
            animateValue(finalScore, 0, total, 1000);
        }, letters.length * 150 + 200);
    };

    // Animated number counter
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Ensure exact final value
                obj.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    obj.style.transform = 'scale(1)';
                }, 200);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Event listeners
    calculateBtn.addEventListener('click', calculateScore);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateScore();
        }
    });
});
