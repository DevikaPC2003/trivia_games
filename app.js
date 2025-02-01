let currentQuestionIndex = 0;
let score = 0;
let questions = [];

document.addEventListener("DOMContentLoaded", () => {
    // Fetch questions from the Open Trivia API
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => response.json())
        .then(data => {
            // Parse and store the questions from the API
            questions = data.results.map(q => ({
                question: q.question,
                answers: [...q.incorrect_answers, q.correct_answer].sort(),
                correctAnswer: q.correct_answer
            }));
            document.getElementById("start-btn").style.display = "block"; // Show start button
        })
        .catch(error => console.error('Error loading questions:', error));
});

function loadQuestion() {
    // Ensure there are questions available before proceeding
    if (questions.length === 0) {
        console.error("No questions found.");
        return;
    }

    // Display the current question
    const question = questions[currentQuestionIndex];
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `<h3>${question.question}</h3>`;

    // Display answer buttons
    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";
    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("btn");
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (selectedAnswer === correctAnswer) {
        score++;
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById("game-container").style.display = "none";
    const resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "block";
    document.getElementById("score").textContent = `Your score is: ${score} out of 10`;
}

document.getElementById("start-btn").onclick = () => {
    loadQuestion();
    document.getElementById("start-btn").style.display = "none";
};

document.getElementById("restart-btn").onclick = () => {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("game-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    loadQuestion();
};
