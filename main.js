const preloadImages = () => {
    questions.forEach(question => {
        if (question.image) {
            const img = new Image();
            img.src = question.image;
        }
    });
};

preloadImages();

const totalQuestions = questions.length;
        let currentQuestions = shuffle([...questions]);
        let skippedQuestions = [];
        let solvedCount = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        const startTime = Date.now();

        function shuffle(array) {
            return array.sort(() => Math.random() - 0.5);
        }

        function updateProgress() {
            document.getElementById("progress").innerText = `Решено вопросов: ${solvedCount} из ${totalQuestions}`;
        }

        function showResults() {
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById("correct-answers").innerText = `Правильных ответов: ${correctCount}`;
            document.getElementById("incorrect-answers").innerText = `Неправильных ответов: ${incorrectCount}`;
            document.getElementById("total-time").innerText = `Время прохождения: ${totalTime} секунд`;

            document.getElementById("quiz-container").style.display = "none";
            document.getElementById("results-container").style.display = "block";
        }

        function loadQuestion() {
            document.getElementById("next").style.display = "none";

            if (currentQuestions.length === 0 && skippedQuestions.length > 0) {
                currentQuestions = shuffle([...skippedQuestions]);
                skippedQuestions = [];
            }

            if (currentQuestions.length === 0) {
                showResults();
                return;
            }

            const currentQuestion = currentQuestions.shift();

            document.getElementById("question").innerText = currentQuestion.question;

            if (currentQuestion.image) {
                document.getElementById("question-image").src = currentQuestion.image;
                document.getElementById("image-container").style.display = "block";
            } else {
                document.getElementById("image-container").style.display = "none";
            }

            const optionsContainer = document.getElementById("options");
            optionsContainer.innerHTML = "";

            const shuffledOptions = shuffle(currentQuestion.options.map((option, index) => ({
                text: option,
                index: index
            })));

            shuffledOptions.forEach(option => {
                const button = document.createElement("button");
                button.innerText = option.text;
                button.addEventListener("click", () => {
                    if (option.index === currentQuestion.correctAnswer) {
                        button.classList.add("correct");
                        correctCount++;
                    } else {
                        button.classList.add("incorrect");
                        incorrectCount++;
                        Array.from(optionsContainer.children).forEach((btn, idx) => {
                            if (idx === currentQuestion.correctAnswer) {
                                btn.classList.add("correct");
                            }
                        });
                    }
                    Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
                    document.getElementById("next").style.display = "inline-block";
                });
                optionsContainer.appendChild(button);
            });

            document.getElementById("skip").onclick = () => {
                skippedQuestions.push(currentQuestion);
                loadQuestion();
            };
        }

        document.getElementById("next").addEventListener("click", () => {
            solvedCount++;
            updateProgress();
            loadQuestion();
        });

        updateProgress();
        loadQuestion();
