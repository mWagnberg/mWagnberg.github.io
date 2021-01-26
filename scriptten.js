var counter = 0
var questionCounter = 0

window.onload = (event) => {

  generateNumbers()
  var input = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  countShow.textContent = "Antal rätta svar: " + counter + "/" + questionCounter
  
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
    
    a.textContent = Math.floor(Math.random() * 10)
}

function checkAnswer() {
    let a = document.getElementById("a")
    let answer = document.getElementById("answer")
    let message = document.getElementById("message")
    questionCounter++
    if ((parseInt(a.textContent) + parseInt(answer.value)) == 10) {
      counter ++
      message.textContent = "Rätt svar"
    } else {
      message.textContent = "Fel svar"
    }
    var countShow = document.getElementById("countShow")
    countShow.textContent = "Antal rätt svar: " + counter + "/" + questionCounter
    generateNumbers()
}