var counter = 0
var questionCounter = 0
var randomNumbers = [1,2,3,4,5,6,7,8,9,10]
var startTime
var endTime

window.onload = (event) => {

  generateNumbers()
  var input = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  countShow.textContent = "10-kompisar"
  
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
    const randomElement = randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
    a.textContent = randomElement
    const index = randomNumbers.indexOf(randomElement);
    if (index > -1) {
      randomNumbers.splice(index, 1);
    }
}

function checkAnswer() {
  let button = document.querySelector("#submitBtn")
  if (questionCounter == 0) {
    startTime = new Date()
  }
  
  if (button.textContent == "Starta om") {
    location.reload()
  }
  
  let a = document.getElementById("a")
  let answer = document.getElementById("answer")
  let message = document.getElementById("message")
  questionCounter++
  console.log("COUNTER: " + questionCounter)
  if ((parseInt(a.textContent) + parseInt(answer.value)) == 10) {
    counter ++
    message.textContent = "Rätt svar"
  } else {
    message.textContent = "Fel svar"
  }
  var countShow = document.getElementById("countShow")
  if (questionCounter < 11) {
      countShow.textContent = counter + "/" + questionCounter
      if (questionCounter == 10) {
        gameOver()
      } else {
        generateNumbers()
      }
  }
}

function gameOver() {
  let message = document.getElementById("message")
  let tendiv = document.getElementById("tendiv")
  let a = document.getElementById("a")
  let answer = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  endTime = new Date()
  var timeDiff = endTime - startTime
  timeDiff /= 1000
  var seconds = Math.round(timeDiff)
  countShow.textContent = counter + "/" + questionCounter + " rätt på " + seconds + " sekunder"
  // tendiv.classList.add("hideElement")
  a.classList.add("hideElement")
  answer.classList.add("hideElement")
  message.classList.add("hideElement")
  let button = document.querySelector("#submitBtn")
  button.textContent = "Starta om"
}