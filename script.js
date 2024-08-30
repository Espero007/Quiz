let donnees


// fetch('https://opentdb.com/api.php?amount=200&category=19&type=multiple')
// .then(response => response.json())
// .then(data => {






// })

// CONSTANTS
const questionTxt = document.getElementById('question')
const questionCounterTxt = document.getElementById('questionCounterTxt')
const optionsTxt = Array.from(document.querySelectorAll('#optionTxt'))

const options = Array.from(document.querySelectorAll('#responsesContainer button'))
const btn = document.getElementById('btn')


const questionCounter = 1



// FUNCTIONS


/////////////// ANIMATIONS /////////////// 
const score = document.getElementById('score')


const animateScore = (increasing, descreasing) => {

    if (increasing) {

        score.classList.add('animate-increasing-score')
        score.textContent = "30"

        setTimeout(() => {
            score.classList.remove('animate-increasing-score')
        }, 1000)

    }

    else if (descreasing) {

        score.classList.add('animate-decreasing-score')
        score.textContent = "30"

        setTimeout(() => {
            score.classList.remove('animate-decreasing-score')
        }, 1000)

    }
}




const placeCorrectAnswer = (answers, correctAnswer) => {

    let randomIndex = Math.floor(Math.random() * answers.length)
    // answers should be of length 3

    answers[randomIndex] = correctAnswer
    return [answers, randomIndex]
}

const getQuestions = () => {
    fetch('../src/quiz.json')
        .then(response => response.json())
        .then(data => {

            const questions = [...data.results]

            startGame(questions)
        })
}

function startGame(questions) {

    const randomIndex = Math.floor(Math.random() * questions.length)

    const choosenQuestion = questions[randomIndex]

    questionTxt.textContent = choosenQuestion.question

    questionCounterTxt.textContent = questionCounter

    let answers = choosenQuestion["incorrect_answers"]
    const correctAnswer = choosenQuestion["correct_answer"]
    const correctAnswerIndex = 0

    [answers, correctAnswerIndex] = placeCorrectAnswer(answers, correctAnswer)


    console.log(answers, choosenQuestion)

    // optionsTxt.forEach(option =>{
    //     const optionIndex = optionsTxt.indexOf(option)

    //     option.textContent = answers[optionIndex]
    // })

}
/////////////// MAIN FUNCTIONS /////////////// 

// mainContainer.classList.add('animate-appear')




getQuestions()














btn.addEventListener('click', function () {

    // animateMainContainer()
    // animateScore()
    animateTxt()
})

const selectOption = (option) => {

}


options.forEach(button => {
    button.addEventListener('click', function () {
        const index = options.indexOf(button)

        selectOption(index)
    })
})