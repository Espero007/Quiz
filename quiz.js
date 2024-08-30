

//////////////// GAME LOGICAL


// HTML ELEMENTS


const scoreTxt = document.getElementById('score')
const popUps = Array.from(document.querySelectorAll('#popUpsCont p'))
const endGameInterface = document.getElementById('endGameInterface')
const options = Array.from(document.querySelectorAll('#answersCont button'))
const skipBtn = document.querySelector('#skipBtn')
const questionCounterTxt = document.getElementById('questionCounterTxt')
const questionTxt = document.getElementById('question')
const optionsTxt = Array.from(document.querySelectorAll('.optionTxt'))
const mainElements = document.getElementById('mainElements')
const txt = document.querySelector('.txt')
const navBtn = document.querySelector('#navBtn')
const navigation = document.querySelector('#sideNavigation')
const restartBtn_1 = document.querySelector('#restartBtn')
const restartBtn_2 = document.querySelector('#restartBtn_2')
const loaderContainer = document.querySelector('.loaderContainer')
const gamePlayInterface = document.querySelector('#gamePlayInterface')


// GLOBALS CONSTANTS & VARIABLES

const BONUX = 1
const MALUX = -2
const MALUX_2 = -1

let questionCounter = 1


let availableQuestions = []
let choosenQuestion = {}

let score = 10

let fisrtTime = true
let gameOver = false


//////////////// FUNCTIONS


const startGame = () => {

    // INITIALIZING

    initializeElements()

    // GETTING QUESTIONS

    fetch('https://opentdb.com/api.php?amount=50&category=19').then(response => response.json()).then(response => {

        console.log(response)


        availableQuestions = placeCorrectAnswer(response.results)

        // Enclencher l'animation de disaprition du loader

        loaderContainer.classList.add('animate-desappear')

        setTimeout(() => {

            // Faire disparaître le loader du flux

            loaderContainer.classList.add('none')
            loaderContainer.classList.remove('animate-desappear')


            // navigation.classList.remove('none')
        }, 1000)

        setTimeout(() => {

            gamePlay(availableQuestions)

            // Faire apparaître l'interface de jeu

            gamePlayInterface.classList.remove('none')
        }, 800)
    })
}

const initializeElements = () => {

    questionCounter = 1
    availableQuestions = []
    choosenQuestion = {}
    fisrtTime = true
    gameOver = false

    score = 10
    scoreTxt.innerHTML = score

    // Faire apparaître le loader

    loaderContainer.classList.remove('none')

    // Faire disparaître tout le reste

    gamePlayInterface.classList.add('none')
    endGameInterface.classList.add('none')
    navigation.classList.add('none')

    // Retirer les classes et styles ajoutés à divers endroits

    navigation.classList.remove('animate-appear')
    navigation.classList.remove('animate-desappear')
    restartBtn_1.disabled = true

    options.forEach(option => {
        option.disabled = false
    })

    skipBtn.disabled = false

    popUps.forEach(popUp => {
        popUp.classList.remove('popUp')
        popUp.style.opacity = "0"
    })
}

const placeCorrectAnswer = (questions) => {

    for (let i = 0; i < questions.length; i++) {

        const questionObj = questions[i]
        const bool = questionObj["incorrect_answers"].length === 2

        if (bool) {
            questionObj["incorrect_answers"].push(questionObj["correct_answer"])

            questionObj["answer_id"] = 2

            console.log(questionObj)


        }
        else {

            const randomIndex = Math.floor(Math.random() * 3)

            questionObj["incorrect_answers"][randomIndex] = questionObj["correct_answer"]
            questionObj["answer_id"] = randomIndex
        }


    }


    return questions
}

const gamePlay = (availableQuestions) => {

    // Show a random question

    choosenQuestion = showQuestion(availableQuestions)

    fisrtTime = false

    options.forEach(option => {
        option.addEventListener('click', () => {

            options.forEach(option => {
                option.classList.remove('is-selected')
            })

            option.classList.add('is-selected')

            checkAnswerValidity(choosenQuestion["answer_id"], options.indexOf(option))
        })
    })

    skipBtn.addEventListener('click', () => {

        if (score <= 1) {

            score = 0
            gameOver = true

            options.forEach(option => {
                option.disabled = true
            })

            skipBtn.disabled = true

            endGame()
        }


        animateScore(false, true)

        if (!gameOver) {
            score += MALUX_2
            choosenQuestion = showQuestion(availableQuestions)
        }

    })
}

const showQuestion = (availableQuestions) => {

    if (!fisrtTime) {
        animateMainElements()

        const randomIndex = Math.floor(Math.random() * availableQuestions.length)

        question = availableQuestions[randomIndex]

        setTimeout(() => {

            questionCounterTxt.innerHTML = questionCounter
            questionTxt.innerHTML = question.question

            optionsTxt.forEach(option => {
                const index = optionsTxt.indexOf(option)

                option.innerHTML = question["incorrect_answers"][index]
            })

            questionCounter++

        }, 500)

        availableQuestions.splice(randomIndex, 1)

        return question
    }
    else {

        gamePlayInterface.classList.add('animate-first-appear')

        setTimeout(() => {
            options.forEach(option => {
                option.classList.remove('is-selected')
            })
        }, 500)

        setTimeout(() => {
            gamePlayInterface.classList.remove('animate-first-appear')

        }, 2000)

        const randomIndex = Math.floor(Math.random() * availableQuestions.length)

        question = availableQuestions[randomIndex]

        questionCounterTxt.innerHTML = questionCounter
        questionTxt.innerHTML = question.question

        optionsTxt.forEach(option => {
            const index = optionsTxt.indexOf(option)

            option.innerHTML = question["incorrect_answers"][index]
        })

        questionCounter++
        availableQuestions.splice(randomIndex, 1)

        return question
    }
}

const checkAnswerValidity = (answer_id, option_id) => {

    if (answer_id === option_id) {

        score += BONUX
        animateScore(true, false)
        animatePopUps(true, false)

        options.forEach(option => {
            option.disabled = true
        })

        skipBtn.disabled = true

        setTimeout(() => {
            choosenQuestion = showQuestion(availableQuestions)
        }, 1500)

    }
    else {


        if (score <= 2) {

            score = 0

            gameOver = true
            options.forEach(option => {
                option.disabled = true
            })
            skipBtn.disabled = true
        }

        if (!gameOver) {
            score += MALUX
        }
        animateScore(false, true)
        animatePopUps(false, true)

        if (gameOver) {
            endGame()
        }
    }

}

// ENDGAME

const endGame = () => {

    setTimeout(() => {
        gamePlayInterface.classList.add('animate-desappear')

        setTimeout(() => {
            endGameInterface.classList.add('endGameInterface-appear')
            endGameInterface.classList.remove('hidden')
            endGameInterface.classList.remove('none')
        }, 500)
    }, 1000)

    setTimeout(() => {
        gamePlayInterface.classList.remove('animate-desappear')
        gamePlayInterface.classList.add('none')
    }, 2000)

    restartBtn_2.addEventListener('click', () => {

        endGameInterface.classList.remove('endGameInterface-appear')
        endGameInterface.classList.add('hidden')
        endGameInterface.classList.add('none')

        startGame()
    })
}

// NAVIGATION TOGGLE

navBtn.addEventListener('click', () => {

    navigation.classList.remove('none')

    if (navigation.classList.contains('animate-appear')) {

        navigation.classList.remove('animate-appear')

        navigation.classList.add('animate-desappear')
        restartBtn_1.disabled = true

    }
    else if (navigation.classList.contains('animate-desappear')) {

        navigation.classList.remove('animate-desappear')
        navigation.classList.add('animate-appear')

        restartBtn_1.disabled = false
    }
    else {
        navigation.classList.add('animate-appear')
        restartBtn_1.disabled = false
    }
})

// RESTART THE GAME BY THE NAVIGATION BTN

restartBtn_1.addEventListener('click', () => {
    startGame()
})

// ANIMATIONS FUNCTIONS

const animateMainElements = () => {
    mainElements.classList.add('animate-appear')

    popUps[0].classList.remove('bounce')
    popUps[0].style.opacity = "0"


    options.forEach(option => {
        option.classList.remove('is-selected')
        option.disabled = false
    })

    skipBtn.disabled = false

    setTimeout(() => {
        mainElements.classList.remove('animate-appear')
    }, 1300)
}

const animateTxt = () => {
    txt.classList.add('bounce')

    setTimeout(() => {
        txt.classList.remove('bounce')
    }, 2000)
}

const animateScore = (increasing, descreasing) => {

    if (increasing) {

        scoreTxt.classList.add('animate-increasing-score')
        scoreTxt.textContent = `${score}`

        setTimeout(() => {
            scoreTxt.classList.remove('animate-increasing-score')
        }, 1000)

    }

    else if (descreasing) {

        scoreTxt.classList.add('animate-decreasing-score')
        scoreTxt.textContent = `${score}`

        setTimeout(() => {
            scoreTxt.classList.remove('animate-decreasing-score')
        }, 1000)
    }
}

const animatePopUps = (rightAnswer, wrongAnswer) => {

    if (rightAnswer) {
        const popUp = popUps[0]

        popUp.style.opacity = "1"
        popUp.classList.add('bounce')

        return popUp

    }
    else if (wrongAnswer) {
        const popUp = popUps[1]

        if (popUp.classList.contains('popUp')) {
            popUp.classList.remove('popUp')
            popUp.style.opacity = "0"
        }


        setTimeout(() => {
            popUp.style.opacity = "1"
            popUp.classList.add('popUp')

        }, 200)
    }
}


// LAUNCH THE GAME FIRST TIME

if (fisrtTime) {
    startGame()
}