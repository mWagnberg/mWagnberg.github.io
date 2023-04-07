var counter = 0
var questionCounter = 0
var randomNumbers = [1,2,3,4,5,6,7,8,9,10]
var startTime
var endTimes
var questionsAndAnswers = [
  {
    "number": 0,
    "question": "Vad är det för dag idag?",
    "answer": "påskafton",
    "task": ""
  },
  {
    "number": 1,
    "question": "Hur många påskpynt är det i riset?",
    "answer": "12",
    "task": ""
  },
  {
    "number": 2,
    "question": "Hur många pinnar finns det på armgången på pippigungan?",
    "answer": "7",
    "task": ""
  },
  {
    "number": 3,
    "question": "Hur många hattar hänger det på väggen på altanen?",
    "answer": "4",
    "task": ""
  },
  {
    "number": 4,
    "question": "Hur många garageportar finns det på vårt område?",
    "answer": "24",
    "task": ""
  },
  {
    "number": 5,
    "question": "Vem dog på långfredagen?",
    "answer": "jesus",
    "task": ""
  },
  {
    "number": 6,
    "question": "Vad brukar man ofta lyssna på på vilan på slottet?",
    "answer": "snick och snack",
    "task": ""
  },
  {
    "number": 7,
    "question": "Vad har vår nya bil registreringsskylt?",
    "answer": "emk67t",
    "task": ""
  },
  {
    "number": 8,
    "question": "Hur många fönster finns det i vår ytterdörr?",
    "answer": "3",
    "task": ""
  },
  {
    "number": 9,
    "question": "Vad heter påsk på engelska?",
    "answer": "easter",
    "task": ""
  },
  {
    "number": 10,
    "question": "Från vilket land kommer traditionen med påskharen?",
    "answer": "tyskland",
    "task": ""
  },
  {
    "number": 11,
    "question": "Hur många svarta tangenter finns det på vårt elpiano?",
    "answer": "36",
    "task": ""
  },
  {
    "number": 12,
    "question": "Hur många fotbollar frinns det i förrådet?",
    "answer": "4",
    "task": ""
  },
  {
    "number": 13,
    "question": "Påskharen kommer med påskägg, men vad brukar det finnas i äggen?",
    "answer": "godis",
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
    let value = answer.value.trim()
    if ((value.toLowerCase() == questionsAndAnswers[counter].answer) || (value.toLowerCase() == questionsAndAnswers[counter].answer2)) {
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
  countShow.textContent = "Ni har nu svarat på alla frågor, äggen finns där vi har våra cyklar"
  // tendiv.classList.add("hideElement")
  a.classList.add("hideElement")
  answer.classList.add("hideElement")
  message.classList.add("hideElement")
  let button = document.querySelector("#submitBtn")
  button.classList.add("hidee")
}
