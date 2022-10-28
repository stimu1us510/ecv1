let currentModalData = [] //global variable for current sentence data

// -- when button on sentence card is pressed -- //
function setNewModalData(newSentenceData) {
    // set data
    currentModalData = newSentenceData
    const { AudioURL, EngPlain, EngWordOrder, JpnPlain, JpnWordOrder, LevelShown, Match01_by_calc, SentenceId, TimeLimit, list_of_alternative_matches } = currentModalData
    
    // set display
    document.querySelector('#japanese-phrase-plain').innerHTML = AudioURL + EngPlain + Match01_by_calc + list_of_alternative_matches
    hideElements('#nextButton, #endSpeechButton')
    console.log(currentModalData, AudioURL)
}