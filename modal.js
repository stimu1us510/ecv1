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



function detectDevice() {
    // NOTE: iPad Pro is marked as MacIntel (same as macBooks) so a hack is to check if it has touch
    // but this is only as of now and has the potential to break in the future if apple add touch to macBooks
  var ua = navigator.userAgent;
  
  let makeFullscreen = () => {
  document.querySelector(".modal-dialog").classList.add("modal-fullscreen")
  document.querySelector(".modal-dialog-centered").classList.add("modal-dialog-centered-fix")
  document.querySelector(".modal-content").classList.add("border-0")
  }
  if(/Android|webOS/i.test(ua)) {
    detectedDevice = "android"
    makeFullscreen()
    }
    else if(/iPhone|iPad|iPod/i.test(ua)){
        detectedDevice = "iOS"
        makeFullscreen()
    }
    else if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0){
        detectedDevice = "iOS"
        makeFullscreen()
    }
    else if(/Chrome/i.test(ua)){
    detectedDevice = "chrome"
    }
    else {
    detectedDevice = "other"
    }
}




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

// -- on page load -- //
detectDevice()