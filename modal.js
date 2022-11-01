const myModalEl = document.getElementById('exampleModal')
const phraseAudio = document.getElementById('phraseaudio')
const listenButton = document.getElementById('listen-button')
const translateButton = document.getElementById('translate-button')
const startSpeechButton = document.getElementById('start-speech-button')
const endSpeechButton = document.getElementById('end-speech-button')
const nextButton = document.getElementById('next-button')
const mainOutputDisplay = document.getElementById('main-output-container')


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
  var ua = navigator.userAgent

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
  document.querySelector('#main-output-container').innerHTML = instruction
  //document.querySelector('#japanese-text').innerHTML = JpnPlain
  // set audio
  phraseAudio.setAttribute('src', AudioURL)
  phraseAudio.load()

  
  //document.querySelector('#japanese-phrase-plain').innerHTML = AudioURL + EngPlain + Match01_by_calc + list_of_alternative_matches
  //hideElements('#nextButton, #endSpeechButton')
  //console.log(currentModalData)
}

function testConfetti() {
    return canvas.confetti({spread: 70,origin: { y: 0.9 }})
}

function goToNextCardModal() {
    try { //try click the launch modal button on the next card
        document.getElementById(currentModalData.SentenceID).closest('.card').nextElementSibling.querySelector("button").click()
    } catch { try { //catch no more cards in dom error and try create more cards
                showMoreButton.click()
                document.getElementById(currentModalData.SentenceID).closest('.card').nextElementSibling.querySelector("button").click()
        } catch { //no more cards to create?
            console.warn("There are no more sentences to show")
        }}
}


// -- helper functions -- //
const disableButtons = listOfElements => document.querySelectorAll(listOfElements).forEach(e => e.disabled = true)
const enableButtons = listOfElements => document.querySelectorAll(listOfElements).forEach(e => e.disabled = false)

// -- button events -- //
nextButton.onclick = () => {
    goToNextCardModal()
}







// -- speech-to-text -- //
if ("webkitSpeechRecognition" in window) {
  let recognition = new webkitSpeechRecognition()
  recognition.lang = 'en-US';
  recognition.continuous = true
  recognition.interimResults = true
  detectDevice()
  //correctaudio.volume = 0.2 // volume on correct answer was too high
    
  recognition.onstart = () => {
  showElements('#end-speech-button, #mic-active-button')
  hideElements('#main-output-container, #translate-button, #listen-button, #start-speech-button')
  disableButtons('#listen-button, #translate-button')
  //startSpeechButton.innerHTML = `<span class="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true"></span>`
  //disableButtons()
  //isMatched = false
  //timeUp = false
  //updateStatus(statusArray[0]) //status: loading...
  }
    
    recognition.addEventListener('audiostart', function() {
        //set display
        //hideElements('#main-output-container')
        //showElements('#mic-active-button')
        //updateStatus("") // clear loading text when ready to accept audio input from the microphone
        // updateScoreResult("")
        // clearInputText()
        // timercontainer.classList.remove("hide") // show timer bar again on start if hidden
        // tBar.set(0)
        // tBar.animate(1, {duration: countdownTime},  function() {
        // timeUp = true
        // recognition.onspeechend()
        // })
    })
    
    recognition.onspeechend = () => {
        // situation: match found but already said correctly
        // if(isMatched && clearedPhrases.includes(currentButtonId.id)){
        //     recognition.stop()
        //     correctAgain()
        // }
        // // situation: match found and said correctly for the first time!
        // if(isMatched && !clearedPhrases.includes(currentButtonId.id)){
        //     recognition.stop()
        //     correctFirstTime()
        // }
        // // situation: timer has ended and no match
        // if(timeUp  && !isMatched){
        //     recognition.stop()
        //     timeIsUp()
        // }
        // // situation: no match found and ignore the timer for (andriod chrome only)
        // if(detectedDevice === 'android'){
        //     if(!isMatched){
        //         recognition.stop()
        //         timeIsUp()
        //         }
        // }
    };

    recognition.onresult = (result) => {
        var final = "";
        var interim = "";
        var results = event.results;
        
        for (var i = 0; i < event.results.length; ++i) {
        // what to do with results when device is android chrome
        if(detectedDevice === 'android'){
            if (event.results[i].isFinal) {
                final = event.results[i][0].transcript;
                } else {
                interim = event.results[i][0].transcript;
                }
            }
            
        // what to do with results device is iOS chrome
        if(detectedDevice === 'iOS'){
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript + " ";
                } else {
                interim += event.results[i][0].transcript;
                }
            }
            
        // what to do with results when not mobile
        if(detectedDevice === 'chrome' || detectedDevice === 'other'){
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
                } else {
                interim += event.results[i][0].transcript;
                }
            }
        }
        
        final_span.innerHTML = final
        interim_span.innerHTML = interim
        var finalResult = final+interim
        // isMatched = matchesArray.some(substring=>finalResult.toLowerCase().endsWith(substring))
        
        if(finalResult.length < currentModalData.Match01_by_calc.length-1) return //

        console.log("checking for a match now")
        if (finalResult.includes(currentModalData.Match01_by_calc)) {
            recognition.abort()
            canvas.confetti({spread: 70,origin: { y: 0.9 }})
            mainOutputDisplay.style.color = 'green'
            mainOutputDisplay.innerHTML = `<span class="fs-1 fw-bold">${currentModalData.EngPlain}</span>`
            document.querySelectorAll('#final_span, #interim_span').forEach(e => e.innerHTML='')
            hideElements('#end-speech-button, #mic-active-button')
            showElements('#main-output-container, #translate-button, #listen-button, #start-speech-button')
            enableButtons('#listen-button, #translate-button')
            console.log("match check finished")
        }
        

        // if(isMatched) {
        // recognition.abort() // abort stops returning results after a match, better than recognition.stop()
        // tBar.set(0)
        // markCorrectText() 
        // }
    }
    
    // button event listeners
    translateButton.onclick = () => {
      mainOutputDisplay.innerHTML = currentModalData.JpnPlain
      translateButton.classList.add("d-none")
    }
    
    listenButton.onclick = () => {
        listenButton.innerHTML = `<i class="bi bi-broadcast"></i>`
        disableButtons('#listen-button')
        listenButton.disabled = true
        phraseAudio.currentTime = 0
        phraseAudio.play()
    }
    
    startSpeechButton.onclick = () => {
        phraseAudio.pause() // pause audio to stop interference with recognition
        //speechButton.innerHTML = `<span class="spinner-grow spinner-grow-sm text-danger" role="status" aria-hidden="true"></span>`;
        //changeDisplay("listenButton,translateButton","endSpeechButton")
        recognition.start()
    }

    phraseAudio.addEventListener('ended', function() {
        listenButton.innerHTML = `<i class="bi bi-play">`
        listenButton.disabled = false
    })
    
    endSpeechButton.onclick = () => {
        recognition.abort()
        console.log("speech has ended")
        hideElements('#end-speech-button, #mic-active-button')
        showElements('#translate-button, #listen-button, #start-speech-button')
        // tBar.set(1)
        // timeIsUp()
    }
    

    myModalEl.addEventListener('hidden.bs.modal', function (event) {
        // stop input/output
        recognition.stop()
        phraseAudio.pause()
        // reset display
        hideElements('#end-speech-button, #mic-active-button, #next-button')
        showElements('#translate-button, #listen-button, #start-speech-button')
        mainOutputDisplay.innerHTML = instruction

        console.log("speech stopped")
        })
    
    // // keydown listeners for keyboard controls
    // window.addEventListener('keydown', (event) => {
    // switch (event.key) {
    //     case 'q': // stop stt
    //         recognition.abort()
    //         timeIsUp()
    //         break
    //     case 'd': // next list item
    //         nextButton.click()
    //         break
    //     case 'a': // listen to audio
    //         listenButton.click()
    //         break
    //     case 's': // start stt
    //         speechButton.click()
    //         break
    //     case 'w': // show Japanese text
    //         showJapaneseTextButton.click()
    //     }
    // })
    
} else {
    status.innerHTML = "Sorry not speech-to-text is not supported 😭";
}






























// -- on page load -- //
// detectDevice()