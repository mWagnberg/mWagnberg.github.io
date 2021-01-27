let counter = 0
let questionCounter = 0

window.onload = (event) => {

  generateNumbers()
  var input = document.getElementById("answer")
  var countShow = document.getElementById("countShow")
  countShow.textContent = "Multiplikation"
  
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
    let b = document.getElementById("b")
    
    a.textContent = Math.floor(Math.random() * 10)
    b.textContent = Math.floor(Math.random() * 10)
}

function checkAnswer() {
    let a = document.getElementById("a")
    let b = document.getElementById("b")
    let answer = document.getElementById("answer")
    let message = document.getElementById("message")
    questionCounter++
    if ((a.textContent * b.textContent) == answer.value) {
      counter ++
      message.textContent = "Rätt svar"
    } else {
      message.textContent = "Fel svar"
    }
    var countShow = document.getElementById("countShow")
    countShow.textContent = counter + "/" + questionCounter
    generateNumbers()
}