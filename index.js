const signupForm = document.getElementById('signup-form')
const signupCard = document.getElementById('signup-card')
const loginForm = document.getElementById('login-form')
const loginCard = document.getElementById('login-card')
const helperTools = document.getElementById('helper-tools')
const showMoreButton = document.getElementById('see-more-sentences-container')
const loadingSpinner = document.getElementById('fetching-data-loader')
const sentencesContainer = document.getElementById('sentences-container')
const errorMessageBox = document.getElementById('error-message-alert')
const errorMessageText = document.getElementById('error-message-text')
let user = '' //stores username after auth
let size = 0 // used for display sentence cards
let isDatafetched = false // used for loading sentence cards display
let isInitialLoad = true //scrolls to first card after fetch, but won't on any more loadSentences calls
var helperToolsToggle = true

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
      errorAlert("There was an error signing up")
    })
  payload = {}
})

function authMe2() {
fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/auth/me', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {
    if(!response.ok) {
        console.log("authErr")
        setNoAuthDisp()
        showHero()
        //showAuthForms()  >> document.querySelector('#getAuth-forms').classList.remove('d-none')
    } else {
      console.log("sucessfully auth")
      hideAuthForms()
      return response.json()
    }
  })
  .then(function (data) {
    user = data.name[0].toUpperCase() + data.name.slice(1)
    hideHero()
    setAuthDisp()
    // get data for dashboard screen after authed
    getTotalScore() 
    getSevenDayHistory()
    return data.id
    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  })    
}

function logout() {
    localStorage.setItem('authkey', '')
    //setNoAuthDisp() //reset display to pre-logged in state
    location.reload() //reload to show login screen
}

function clearSentences() {
    size = 0
    showMoreButton.classList.add('hide')
    while(sentencesContainer.hasChildNodes()) sentencesContainer.removeChild(sentencesContainer.lastChild)
}

function showHero() {
  document.querySelectorAll('#hero-section, #sign-up-button, #log-in-button').forEach(e => e.classList.remove('d-none'))
  hideAuthForms()
}

function hideHero() {
  document.querySelector('#hero-section').classList.add('d-none')
}

function dispSignup() {
  document.querySelector('#getAuth-forms').classList.remove('d-none')
  document.querySelectorAll('#login-card, #sign-up-button, #signup-link').forEach(e => e.classList.add('d-none'))
  document.querySelectorAll('#signup-card, #log-in-button, #login-link').forEach(e => e.classList.remove('d-none'))
  hideHero()
}

function dispLogin() {
  document.querySelector('#getAuth-forms').classList.remove('d-none') // show auth-forms
  document.querySelectorAll('#signup-card, #log-in-button, #login-link').forEach(e => e.classList.add('d-none'))
  document.querySelectorAll('#login-card, #sign-up-button, #signup-link').forEach(e => e.classList.remove('d-none'))
  hideHero()
}

function hideAuthForms() {
  document.querySelector('#getAuth-forms').classList.add('d-none')
}

function hideAuthButtons() {
  document.querySelector('#log-in-button').classList.add('d-none')
  document.querySelector('#sign-up-button').classList.add('d-none')
}

// function showAuthForms() {
//  document.querySelector('#getAuth-forms').classList.remove('d-none')
// }

function setAuthDisp() {
  document.querySelector('#user-history-cont').classList.remove('d-none')
  document.querySelector('#welcome-alert-container').classList.remove('d-none')
  document.querySelector('#user-profile-dropdown').classList.remove('d-none')
  document.querySelector('#footer').classList.remove('d-none')
  document.querySelector('#log-out-button').classList.remove('d-none')
  document.querySelector('#log-in-button').classList.add('d-none')
  document.querySelector('#sign-up-button').classList.add('d-none')
  document.querySelector('#home-button').classList.add('d-none')
  document.querySelector('#dashboard-button').classList.remove('d-none')
  document.querySelector('#welcome-user').innerHTML = user
}

function setNoAuthDisp() {
  clearSentences()
  document.querySelector('#user-history-cont').classList.add('d-none')
  document.querySelector('#welcome-alert-container').classList.add('d-none')
  document.querySelector('#user-profile-dropdown').classList.add('d-none')
  document.querySelector('#log-out-button').classList.add('d-none')
  document.querySelector('#sign-up-button').classList.remove('d-none')
  document.querySelector('#home-button').classList.remove('d-none')
  document.querySelector('#dashboard-button').classList.add('d-none')
}

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

// -- button functions -- //
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

const showGoToTopButton = _ => document.getElementById("goToTop").classList.add("d-none")
const hideGoToTopButton = _ => document.getElementById("goToTop").classList.remove("d-none")
document.addEventListener("scroll", (e) => window.scrollY > 400 ? hideGoToTopButton() : showGoToTopButton())

const pointForm = document.getElementById('point-form')
const changeToDateFormat = d => d.toJSON().slice(0,10).split('-').reverse().join('/')
const myChart = new Chart(document.getElementById('myChart'), chartOneConfig)
const myChart2 = new Chart(document.getElementById('myChartTwo'), chartTwoConfig)

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
    console.log(data)

      document.querySelector('#current-total-score').innerHTML = data.totalPoints

    // try {
    //   document.querySelector('#current-total-score').innerHTML = data.totalPoints
    // } catch {
    //   document.querySelector('#current-total-score').innerHTML = data 
    // }
    
    getSevenDayHistory()
    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  })    
}

function getTotalScore() {
  let dateNow = Date.now()
  let postData = { timeStamp : dateNow }
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/user_history/{user_history_id}/get_total_score', {
  method: 'POST',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
  body: JSON.stringify(postData)
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    document.querySelector('#current-total-score').innerHTML = data
    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  })   
}

function getSevenDayHistory() {
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/user_history_get_all', {
    method: 'GET',
    headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    
    myChart.config.data.datasets[0].data.length = 0
    myChart.config.data.labels.length = 0

    data.map(dataObject => {
        dataObject.created_at = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric' }).format(dataObject.created_at)
        myChart.data.labels.push(dataObject.created_at)
        myChart.config.data.datasets[0].data.push(dataObject.totalPoints)
    })
    
    myChart.data.labels = myChart.data.labels.slice(-7)
    myChart.config.data.datasets[0].data = myChart.config.data.datasets[0].data.slice(-7)
    myChart.update('none')

    })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
  }) 
}

function loadSentences() {
  const sentences = document.createDocumentFragment()
  fetchedSentencesData.slice(size, size+50).map(function (i, a) {
    // create card
    let card = document.createElement('div')
    card.classList.add('card')
    card.classList.add('mb-5')
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    // card number
    //let number = document.createElement('h4')
    //number.innerHTML = `${size === 0 ? a + 1 : size + (a + 1)}`

    let gradePill = document.createElement('div')
    gradePill.classList.add('d-inline-flex', 'mb-3', 'px-2', 'py-1', 'fw-light','fs-6', 'text-success', 'bg-success', 'bg-opacity-10', 'border', 'border-success', 'border-opacity-10', 'rounded-2')
    gradePill.innerHTML = `${i.Grade}`

    // make main accordian
    let mainAccord = document.createElement('details')
    let mainAccordSummary = document.createElement('summary')
    mainAccord.appendChild(mainAccordSummary)
    mainAccordSummary.innerHTML = `<span class="mainAccord--summary">${i.JpnPlain}</span>`
    
    // make first nested accordian
    let nestAccordOne = document.createElement('details')
    nestAccordOne.classList.add('nested')
    let nestAccordOneSummary = document.createElement('summary')
    nestAccordOne.innerHTML = `${i.JpnWordOrder}`
    nestAccordOne.appendChild(nestAccordOneSummary)
    nestAccordOneSummary.innerHTML = `<span class="nestAccord--summary">Word Order</span>`
    mainAccord.appendChild(nestAccordOne)
    
    // make second nested accordian
    let nestAccordTwo = document.createElement('details')
    nestAccordTwo.classList.add('nested')
    let nestAccordTwoSummary = document.createElement('summary')
    nestAccordTwo.innerHTML = `${i.EngPlain}`
    nestAccordTwo.appendChild(nestAccordTwoSummary)
    nestAccordTwoSummary.innerHTML = `<span class="nestAccord--summary">English</span>`
    mainAccord.appendChild(nestAccordTwo) 

    // make modal button
    let modalButtonContainer = document.createElement('div')
    modalButtonContainer.classList.add('d-flex', 'flex-row-reverse')
    let modalButton = document.createElement('button')
    modalButton.classList.add('btn', 'btn-lg', 'btn-outline-secondary', 'modal-btn', 'rounded-1')
    modalButton.setAttribute('id', `${i.SentenceID}`)
    modalButton.setAttribute('data-bs-toggle', 'modal')
    modalButton.setAttribute('data-bs-target', '#exampleModal')
    //modalButton.setAttribute('style', 'border-opacity: 0.5; border-width: 2px;')
    modalButton.innerHTML = `<span class="fw-bold"> ${i.LevelShown} ${i.LevelShown > 1 ? 'pts' : 'pt'}!</span>`
    modalButtonContainer.appendChild(modalButton)
    
    // append each element to card body
    //cardBody.appendChild(number)
    cardBody.appendChild(gradePill)
    cardBody.appendChild(mainAccord)
    cardBody.appendChild(modalButtonContainer)
    
    // append to body to card and card to sentences
    card.appendChild(cardBody)
    sentences.appendChild(card)

    modalButton.addEventListener("click", () => setNewModalData(i))
    })
  
  sentencesContainer.appendChild(sentences)
  if (isInitialLoad) sentencesContainer.scrollIntoView()
  isInitialLoad = false
  document.querySelector('#randomizeButton').classList.remove('d-none')
  size = size +50
}

showMoreButton.onclick = () => {
  loadSentences()
}

function showKey() {
    console.log(localStorage.getItem('authkey'))
    errorAlert(`This is the authkey: ${localStorage.getItem('authkey')}`)
}

function getLockedSentences() {
  loadingSpinner.classList.remove('d-none') //display fetching data
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/sentences-with-auth', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    fetchedSentencesData = data  // JSON from our response saved as fetchedData
    isDatafetched = true
    showMoreButton.classList.remove('d-none')
    loadingSpinner.classList.add('d-none')
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
    errorMessageBox.classList.remove('d-none')
    errorMessageText.innerHTML = errMessage
    setTimeout(() => {
    errorMessageBox.classList.add('d-none')
    }, 2000)
}

// -- initial page load functions -- //
hideHero() 
hideAuthButtons()
hideAuthForms()
authMe2() // check authed