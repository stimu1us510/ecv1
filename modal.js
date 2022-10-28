const statusArray = ["Loading...", "Match found!!", "Time's up!"]
const praiseArray = ["Great!","Good Job!", "Excellent!"]
const instruction = `<i class="bi bi-play"></i>  Hear the phrase <br><br> <i class="bi bi-lightbulb"></i>  Check the meaning <br><br> <img class="" src="https://surasura-challenge.com/wpfiles/wp-content/uploads/2022/09/confetti.png" style="height:30px; width:30px;"></img>  Repeat the phrase!`

// -- confetti -- //
const canvas = document.getElementById('confetticanvas')
canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true })

var currentModalData = [] //global variable for current sentence data
let detectedDevice = "unknown"
let currentPraise = "Great!"
let clearedPhrases = []
let triedPhrases = []

// -- when button on sentence card is pressed -- //
function setNewModalData(newSentenceData) {
  // set data
  currentModalData = newSentenceData
  const { AudioURL, EngPlain, EngWordOrder, JpnPlain, JpnWordOrder, LevelShown, Match01_by_calc, SentenceID, TimeLimit, list_of_alternative_matches } = currentModalData
  // set display
  document.querySelector('#points').innerHTML = +LevelShown //+num removed trailing 0
  document.querySelector('#total').innerHTML = currentTotalPoints
  document.querySelector('#scoreresultcontainer').innerHTML = instruction
  document.querySelector('#japanese-text').innerHTML = JpnPlain

  
  //document.querySelector('#japanese-phrase-plain').innerHTML = AudioURL + EngPlain + Match01_by_calc + list_of_alternative_matches
  //hideElements('#nextButton, #endSpeechButton')
  console.log(currentModalData)
}

function testConfetti() {
    return canvas.confetti({spread: 70,origin: { y: 0.9 }})
}

function goToNextCardModal() {
    console.log(currentModalData.SentenceID)
    document.getElementById(currentModalData.SentenceID).closest('.card').nextElementSibling.querySelector("button").click()
}




// -- button events -- //
document.querySelector('#nextButton').onclick = () => {
    goToNextCardModal()
}