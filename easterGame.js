var counter = 0
var questionCounter = 0
var randomNumbers = [1,2,3,4,5,6,7,8,9,10]
var startTime
var endTimes
var questionsAndAnswers = [
  {
    "number": 0,
    "question": "Vad är det för dag idag?",
    "answer": "1",
    "task": "Gå till påskriset i köket"
  },
  {
    "number": 1,
    "question": "Hur många risgrenar är det?",
    "answer": "1",
    "task": ""
  },
  {
    "number": 2,
    "question": "Vad är det för figur som kommer med påskäggen på påsken?",
    "answer": "1",
    "task": "Gå till lådan med påskäggen"
  },
  {
    "number": 3,
    "question": "Hur många påskägg finns det?",
    "answer": "1",
    "task": "Gå till altanen"
  },
  {
    "number": 4,
    "question": "Hur många lampor finns det på altanen?",
    "answer": "1",
    "task": ""
  }
]

window.onload = (event) => {

  console.log("QUESTIONS: " + questionsAndAnswers[counter].question)
  console.log("COUNT: " + questionsAndAnswers.length)
  generateNumbers()
  var input = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  // countShow.textContent = "10-kompisar"
  
  input.addEventListener("keyup", function(event) {
    
    if (event.keyCode === 13) {
      document.getElementById("submitBtn").click();
    }
  
  });
};

function generateNumbers() {
    let answer = document.getElementById("answer")
    answer.value = ""

    let a = document.getElementById("a")
    a.textContent = questionsAndAnswers[counter].question
}

function checkAnswer() {
  let a = document.getElementById("a")
  let answer = document.getElementById("answer")
  let message = document.getElementById("message")
  let button = document.querySelector("#submitBtn")
  if (button.textContent == "Nästa fråga") {
    button.textContent = "Rätta"
    message.textContent = ""
    counter ++
    if (counter <= questionsAndAnswers.length) {
      // countShow.textContent = counter + "/" + questionCounter
      if (counter == questionsAndAnswers.length) {
        gameOver()
      } else {
        generateNumbers()
      }
  }
  } else {
    // questionCounter++
    if (answer.value == questionsAndAnswers[counter].answer) {
      message.textContent = questionsAndAnswers[counter].task
      button.textContent = "Nästa fråga"
      a.textContent = "Rätt svar"
    } else {
      message.textContent = "Fel svar"
    }
    // var countShow = document.getElementById("countShow")
  }
}

function gameOver() {
  let message = document.getElementById("message")
  // let tendiv = document.getElementById("tendiv")
  let a = document.getElementById("a")
  let answer = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  endTime = new Date()
  var timeDiff = endTime - startTime
  timeDiff /= 1000
  var seconds = Math.round(timeDiff)
  countShow.textContent = "Du har nu svarat på alla frågor, äggen finns där man gratinerar potatisgratängen"
  // tendiv.classList.add("hideElement")
  a.classList.add("hideElement")
  answer.classList.add("hideElement")
  message.classList.add("hideElement")
  let button = document.querySelector("#submitBtn")
  button.classList.add("hidee")
}