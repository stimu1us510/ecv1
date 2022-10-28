const signupForm = document.getElementById('signup-form')
const loginForm = document.getElementById('login-form')
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
let isFiltered = true
var helperToolsToggle = true //temp delete later

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
fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/auth/me', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {
    if(!response.ok) {
        console.log("authErr")
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
  showElements('#dashboard-button, #log-out-button, #user-profile-dropdown, #welcome-alert-container, #user-history-cont, #footer')
  document.querySelector('#welcome-user').innerHTML = user
}

function setNoAuthDisp() {
  clearSentences()
  hideElements('#dashboard-button, #log-out-button, #user-profile-dropdown, #welcome-alert-container, #user-history-cont')
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
    if (data[0].totalPoints === undefined) return document.querySelector('#current-total-score').innerHTML = '???'
    
    document.querySelector('#current-total-score').innerHTML = data[0].totalPoints

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
  }) 
}

function loadSentences() {
  const sentences = document.createDocumentFragment()
  isFiltered ? sentencesToCreate = fetchedSentencesData.filter(o=>Object.values(o).includes('C 中学標準')) 
  : sentencesToCreate = fetchedSentencesData
  sentencesToCreate.slice(size, size+50).map(function (i, a) {
    // create card
    let card = document.createElement('div')
    card.classList.add('card')
    card.classList.add('mb-5')
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    // card number
    // let number = document.createElement('h4')
    // number.innerHTML = `${size === 0 ? a + 1 : size + (a + 1)}`

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

    modalButton.addEventListener("click", () => setNewModalData(i)) //pass sentence card data to be set for modal/stt use
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

const filterSentences = () => {
  isFiltered = !isFiltered
  clearSentences()
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

// -- on page load -- //
authMe2()