const signupForm = document.getElementById('signup-form')
const loginForm = document.getElementById('login-form')
const helperTools = document.getElementById('helper-tools')
const showMoreButton = document.getElementById('see-more-sentences-container')
const loadingSpinner = document.getElementById('fetching-data-loader')
const sentencesContainer = document.getElementById('sentences-container')
const errorMessageBox = document.getElementById('error-message-alert')
const errorMessageText = document.getElementById('error-message-text')
const tempFilterButton = document.getElementById('temp-filter-button')
let user = '' //stores username after auth
let size = 0 // used for display sentence cards
let currentTotalPoints = 0
let isDatafetched = false // used for loading sentence cards display
let isInitialLoad = true //scrolls to first card after fetch, but won't on any more loadSentences calls
let isFiltered = false
let isFavorited
var helperToolsToggle = true //temp delete later
var searchTextDelayTimer
var textInput = ""
var textInputEng = ""
var textInputJpn = ""

signupForm.addEventListener('submit', function(e) {
  e.preventDefault()

  let formData = new FormData(signupForm),
  payload = {}
  for (let entry of formData.entries()){ payload[entry[0]] = entry[1] }
  
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('authkey', data.authToken)
      location.reload()
     })
    .catch((error) => {
         console.error('Error:', error)
         errorAlert("There was an error signing up")
    })
  payload = {}
})

loginForm.addEventListener('submit', function(e) {
  e.preventDefault()

  let formData = new FormData(loginForm),
  payload = {}
  for (let entry of formData.entries()){ payload[entry[0]] = entry[1] }
  
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/auth/login', {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      localStorage.setItem('authkey', data.authToken)
      location.reload()
     })
    .catch((error) => {
      console.error('Error:', error)
      errorAlert("There was an error logging in")
    })
  payload = {}
})

function authMe2() {
if(!localStorage.getItem('authkey')) {
  setNoAuthDisp()
  showHero()
  return
} 
fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/auth/me', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {
    if(!response.ok) {
        console.warn("User not logged in or there was an error authorizing the user.")
        setNoAuthDisp()
        showHero()
    } else {
      //console.log("sucessfully auth")
      return response.json()
    }})
  .then(function (data) {
    user = data.name[0].toUpperCase() + data.name.slice(1)
    setAuthDisp()
    getDailyTotalScoreBreakdown() 
    getSevenDayHistory()
    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  //errorAlert('Something went wrong.', err)
  })    
}

function logout() {
    localStorage.setItem('authkey', '')
    location.reload()
}

function clearSentences() {
    size = 0
    showMoreButton.classList.add('hide')
    while(sentencesContainer.hasChildNodes()) sentencesContainer.removeChild(sentencesContainer.lastChild)
}

function showHero() {
  document.querySelectorAll('#hero-section, #sign-up-button, #log-in-button').forEach(e => e.classList.remove('d-none'))
  document.querySelector('#getAuth-forms').classList.add('d-none')
}

function dispSignup() {
  hideElements('#hero-section, #login-card, #sign-up-button, #signup-link')
  showElements('#getAuth-forms, #signup-card, #log-in-button, #login-link')
}

function dispLogin() {
  hideElements('#hero-section, #signup-card, #log-in-button, #login-link')
  showElements('#getAuth-forms, #login-card, #sign-up-button, #signup-link')
}

function setAuthDisp() {
  hideElements('#hero-section, #getAuth-forms, #log-in-button, #sign-up-button, #home-button')
  showElements('#dashboard-button, #log-out-button, #user-profile-dropdown, #welcome-alert-container, #user-history-container, #footer')
  document.querySelector('#welcome-user').innerHTML = user
}

function setNoAuthDisp() {
  clearSentences()
  hideElements('#dashboard-button, #log-out-button, #user-profile-dropdown, #welcome-alert-container, #user-history-container')
  showElements('#home-button, #sign-up-button')
}

// -- display control functions -- //
const hideElements = listOfElements => document.querySelectorAll(listOfElements).forEach(e => e.classList.add('d-none'))
const showElements = listOfElements => document.querySelectorAll(listOfElements).forEach(e => e.classList.remove('d-none'))

function clearSentences() {
    size = 0
    showMoreButton.classList.add('hide')
    while(sentencesContainer.hasChildNodes()) sentencesContainer.removeChild(sentencesContainer.lastChild)
}

// temp tool functions to delete int he future
function toggleHelperTools() {
  helperToolsToggle = !helperToolsToggle
  helperToolsToggle ? helperTools.classList.add('d-none') :
  helperTools.classList.remove('d-none')
}

// -- floating action buttons -- //
const showGoToTopButton = _ => document.getElementById("goToTop").classList.add("d-none")
const hideGoToTopButton = _ => document.getElementById("goToTop").classList.remove("d-none")
document.querySelector("#randomizeButton").onclick = () => {
    //document.querySelector("#randomizeButton").disabled = true
    //setTimeout(() => {document.querySelector("#randomizeButton").disabled = false;}, 3000) // stop shuffle spamming
    var loadedSentenceCards = document.querySelector('#sentences-container') //items list must be first match
    var sentenceCardsToShuffle = loadedSentenceCards.querySelectorAll('.card')
    for(let i = sentenceCardsToShuffle.length; i >= 0; i--) loadedSentenceCards.appendChild(sentenceCardsToShuffle[Math.random() * i | 0])
    sentencesContainer.scrollIntoView()
    //window.scrollTo(0, document.getElementById('sentences-container').offsetTop)
    //if(window.scrollY > 400) sentencesContainer.scrollIntoView()
}
document.getElementById("goToTop").onclick = () => sentencesContainer.scrollIntoView()
document.addEventListener("scroll", (e) => window.scrollY > 400 ? hideGoToTopButton() : showGoToTopButton())

// -- create charts w/ temp point form -- //
const myChartOne = new Chart(document.getElementById('myChartOne'), chartOneConfig)
const myChartTwo = new Chart(document.getElementById('myChartTwo'), chartTwoConfig)
const myChartThree = new Chart(document.getElementById('myChartThree'), chartThreeConfig)

const pointForm = document.getElementById('point-form')

pointForm.addEventListener("submit", submitPoints)
function submitPoints(form) {
  form.preventDefault()
  let formData = new FormData(pointForm)
  let date = new Date()
  let dateToSend = date.toISOString()
  let payload = { pointsGained : formData.get('flexRadioDefault'), timeStamp : dateToSend }

  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/user_history/{user_history_id}/point_dist', {
  method: 'POST',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
  body: JSON.stringify(payload)
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    //console.log(data)
    getDailyTotalScoreBreakdown() // this only needs to be called when going into history view
    getSevenDayHistory() // this only needs to be called when going into history view

    // if (data.totalPoints === undefined) return document.querySelector('#current-total-score').innerHTML = '???'
    // document.querySelector('#current-total-score').innerHTML = data.totalPoints

    })
  .catch(function (err) {
	  console.warn('Something went wrong.', err)
    errorAlert('Something went wrong.', err)
  })    
}

function getDailyTotalScoreBreakdown() {
  let dateNow = Date.now()
  let postData = { timeStamp : dateNow }
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/user_history/{user_history_id}/get_total_score', {
  method: 'POST',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
  body: JSON.stringify(postData)
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    if (data === 0) return document.querySelector('#current-total-score').innerHTML = 0
    
    currentTotalPoints = data[0].totalPoints
    document.querySelector('#current-total-score').innerHTML = currentTotalPoints

    let dataNames = {0:'one', 1:'two', 2:'three', 3:'four', 4:'five', 5:'six', 6:'seven', 7:'eight', 8:'nine', 9:'ten'} //for json scheme
    
    // donut chart two: daily breakdown points per level
    myChartTwo.config.data.datasets[0].data.length = 0
    for (let i = 0; i < 10; i++, dataNames) myChartTwo.config.data.datasets[0].data.push(data[0][dataNames[i]])
    myChartTwo.update('none')
   
    // donut chart one: daily breakdown points per level
    myChartThree.config.data.datasets[0].data.length = 0
    for (let i = 0; i < 10; i++, dataNames) myChartThree.config.data.datasets[0].data.push(data[0][dataNames[i]] / (i+1))
    myChartThree.update('none')

    })
  .catch(function (err) {
    errorAlert('Something went wrong.', err)
	  //console.warn('Something went wrong.', err)
  })   
}

function getSevenDayHistory() {
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/user_history_get_all', {
    method: 'GET',
    headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    
    myChartOne.config.data.datasets[0].data.length = 0
    myChartOne.config.data.labels.length = 0

    data.map(dataObject => {
        dataObject.created_at = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric' }).format(dataObject.created_at)
        myChartOne.data.labels.push(dataObject.created_at)
        myChartOne.config.data.datasets[0].data.push(dataObject.totalPoints)
    })
    
    myChartOne.data.labels = myChartOne.data.labels.slice(-7)
    myChartOne.config.data.datasets[0].data = myChartOne.config.data.datasets[0].data.slice(-7)
    myChartOne.update('none')

    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  errorAlert('Something went wrong.', err)
  }) 
}

function loadSentences() {
  const sentences = document.createDocumentFragment()
  isFiltered ? sentencesToCreate = filterArray(fetchedSentencesData, filters) : sentencesToCreate = fetchedSentencesData
  console.log("sentences loaded")
  //console.log(sentencesToCreate)
  sentencesToCreate.slice(size, size+50).map(function (e, i) {
    // create card
    let card = document.createElement('div')
    card.classList.add('card', 'mb-5')
    //card.classList.add()
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // card number
    let number = document.createElement('h4')
    number.innerHTML = `${size === 0 ? i + 1 : size + (i + 1)}`
    // grade pill
    let gradePill = document.createElement('div')
    gradePill.classList.add('grade-pill', 'd-inline-flex', 'mb-3', 'px-2', 'py-1', 'fw-light', 'text-success', 'bg-success', 'bg-opacity-10', 'border', 'border-success', 'border-opacity-10', 'rounded-2')
    gradePill.innerHTML = `${e.Grade}`
    //favorites star
    let favoritesStar = document.createElement('button')
    favoritesStar.classList.add('d-flex', 'flex-row-reverse', 'justify-content-end', 'btn','btn-light')
    favoritesStar.innerHTML = e._user_sentences_addon[0]?.isFavorited ? 
    `<i class="bi bi-star-fill icon-yellow"></i>` : `<i class="bi bi-star"></i>`
    // grade & favorites container
    let gradeFavoritesContainer = document.createElement('div')
    gradeFavoritesContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center')
    gradeFavoritesContainer.appendChild(gradePill)
    gradeFavoritesContainer.appendChild(favoritesStar)
    // make main accordian
    let mainAccord = document.createElement('details')
    let mainAccordSummary = document.createElement('summary')
    mainAccord.appendChild(mainAccordSummary)
    mainAccordSummary.innerHTML = `<span class="mainAccord--summary">${e.JpnPlain}</span>`
    // make first nested accordian
    let nestAccordOne = document.createElement('details')
    nestAccordOne.classList.add('nested')
    let nestAccordOneSummary = document.createElement('summary')
    nestAccordOne.innerHTML = `${e.JpnWordOrder}`
    nestAccordOne.appendChild(nestAccordOneSummary)
    nestAccordOneSummary.innerHTML = `<span class="nestAccord--summary">Word Order</span>`
    mainAccord.appendChild(nestAccordOne)
    // make second nested accordian
    let nestAccordTwo = document.createElement('details')
    nestAccordTwo.classList.add('nested')
    let nestAccordTwoSummary = document.createElement('summary')
    nestAccordTwo.innerHTML = `${e.EngPlain}`
    nestAccordTwo.appendChild(nestAccordTwoSummary)
    nestAccordTwoSummary.innerHTML = `<span class="nestAccord--summary">English</span>`
    mainAccord.appendChild(nestAccordTwo) 
    // make modal button
    let modalButtonContainer = document.createElement('div')
    modalButtonContainer.classList.add('d-flex', 'flex-row-reverse')
    let modalButton = document.createElement('button')
    modalButton.classList.add('btn', 'btn-outline-secondary', 'modal-btn', 'rounded-1')
    modalButton.setAttribute('id', `${e.SentenceID}`)
    modalButton.setAttribute('data-bs-toggle', 'modal')
    modalButton.setAttribute('data-bs-target', '#exampleModal')
    //modalButton.setAttribute('style', 'border-opacity: 0.5; border-width: 2px;')
    modalButton.innerHTML = `<span class="fw-bold"> ${e.LevelShown} ${e.LevelShown > 1 ? 'pts' : 'pt'}!</span>`
    modalButtonContainer.appendChild(modalButton)
    
    // append each element to card body
    //cardBody.appendChild(number)
    //cardBody.appendChild(gradePill)
    cardBody.appendChild(gradeFavoritesContainer)
    cardBody.appendChild(mainAccord)
    cardBody.appendChild(modalButtonContainer)
    // append to body to card and card to sentences
    card.appendChild(cardBody)
    sentences.appendChild(card)
    // button listeners
    modalButton.addEventListener("click", () => setNewModalData(e)) //pass sentence card data to be set for modal/stt use
    favoritesStar.addEventListener("click", () => toggleFavorite(e))   
  })
  sentencesContainer.appendChild(sentences)
  if (isInitialLoad) sentencesContainer.scrollIntoView()
  isInitialLoad = false
  document.querySelector('#randomizeButton').classList.remove('d-none')
  size = size +50
  size >= sentencesToCreate.length ? hideElements('#see-more-sentences-container') : showElements('#see-more-sentences-container')
  sentencesToCreate.length === 0 ? showElements('#no-results-container') : hideElements('#no-results-container')
}

showMoreButton.onclick = () => {
  loadSentences()
}

tempFilterButton.addEventListener("click", () => filterSentences())  

const filterSentences = () => {
  isFiltered = !isFiltered
  if(isFiltered) {
    event.currentTarget.classList.remove('btn-outline-dark')
    event.currentTarget.classList.add('btn-dark')
  } else {
    event.currentTarget.classList.add('btn-outline-dark')
    event.currentTarget.classList.remove('btn-dark')
  }
  clearSentences()
  loadSentences()
  sentencesContainer.scrollIntoView()
}

const toggleFavorite = (e) => {
  let payload = { sentenceIdForFavorites : e.id }
  let selectedFavoriteButton = event.currentTarget
  selectedFavoriteButton.disabled = true
    fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/toggle_favorite', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
      body: JSON.stringify(payload)
      })
      .then(function (response) {return response.json()})
      .then(function (data) {
        if (data === true ) {
          selectedFavoriteButton.innerHTML = `<i class="bi bi-star-fill icon-yellow"></i>`
          e._user_sentences_addon = [{isFavorited: true}]
          selectedFavoriteButton.disabled = false
        } else {
          selectedFavoriteButton.innerHTML = `<i class="bi bi-star"></i>`
          e._user_sentences_addon = [{isFavorited: false}]
          selectedFavoriteButton.disabled = false
        }
        if (isFiltered && data === false) selectedFavoriteButton.parentElement.parentElement.parentElement.remove() // TODO: only remove is favorites filter is active
      })
      .catch(function (err) {
      errorAlert('Something went wrong.', err)
	    //console.warn('Something went wrong.', err)
      }) 
}

function showKey() {
  console.log(localStorage.getItem('authkey'))
  errorAlert(`This is the authkey: ${localStorage.getItem('authkey')}`)
}

function getLockedSentences() {
  showElements('#error-message-container, #fetching-data-loader')
  //loadingSpinner.classList.remove('d-none') //display fetching data
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/sentences-with-auth', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    fetchedSentencesData = data  // JSON from our response saved as fetchedData
    isDatafetched = true
    //get values for buttons
    var gradeListForButtons = [...new Set(fetchedSentencesData.map(item => item.Grade))].sort()
    var pointListForButtons = [...new Set(fetchedSentencesData.map(item => item.Points))].sort((a, b) => a - b)
    var gramCatListForButtons = [...new Set(fetchedSentencesData.map(item => item.Grammar_Categories[0]))].sort()
    console.log(gradeListForButtons, pointListForButtons, gramCatListForButtons)
    showMoreButton.classList.remove('d-none')
    hideElements('#error-message-container, #fetching-data-loader')
    loadSentences()
    console.log(data)
  })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
	showMoreButton.classList.add('d-none')
	errorAlert("Loggin to access this content")
  })    
}

function errorAlert(errMessage) {
    showElements('#error-message-container, #error-message-alert')
    //errorMessageBox.classList.remove('d-none')
    errorMessageText.innerHTML = errMessage
    setTimeout(() => {
      hideElements('#error-message-container, #error-message-alert')
    //errorMessageBox.classList.add('d-none')
    }, 2000)
}


function filterArray(array, filters) {
  const filterKeys = Object.keys(filters)
  return array.filter(item => {
    // validates all filter criteria
    return filterKeys.every(key => {
      // ignores non-function predicates
      if (typeof filters[key] !== 'function') return true
      return filters[key](item[key])
    })
  })
}

var filters = {
  Grade: grade => ['C 中学標準', 'D 中学応用・高校基礎'].includes(grade),
  Points: points => ['4'].includes(points.toLowerCase()),
  Match01_by_calc: Match01_by_calc => {if (Match01_by_calc.includes(textInputEng)) return true},
  JpnPlain: JpnPlain => {if (JpnPlain.includes(textInputJpn)) return true},
  _user_sentences_addon: fav => fav[0]?.isFavorited === !undefined || true,
  Grammar_Categories: gramCat => ['01 文の種類', '10 関係詞'].includes(gramCat[0])
}

function textFilter() {
  clearTimeout(searchTextDelayTimer)
  searchTextDelayTimer = setTimeout(function() {
    textInput = document.getElementById('text-search-input').value
    if (textInput.match(/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g)) {
      textInputEng = ''
      textInputJpn = textInput
      console.log("input is English")
    } else {
      textInputJpn = ''
      textInputEng = textInput
      console.log("input is Japanese")
    }
    clearSentences()
    loadSentences()
  }, 300)
}

// -- on page load -- //
authMe2()