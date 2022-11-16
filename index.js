const signupForm = document.getElementById('signup-form')
const loginForm = document.getElementById('login-form')
const helperTools = document.getElementById('helper-tools')
const loadingSpinner = document.getElementById('fetching-data-loader')
const filtersContainer = document.getElementById('filters-container')
const buttonFilterContainer = document.getElementById('button-filters-container')
const sentencesContainer = document.getElementById('sentences-container')
const showMoreButton = document.getElementById('see-more-sentences-container')
const errorMessageBox = document.getElementById('error-message-alert')
const errorMessageText = document.getElementById('error-message-text')
const tempFilterButton = document.getElementById('temp-filter-button')
let user = '' //stores username on auth
let size = 0 // used for display sentence cards
let currentTotalPoints = 0
let isDatafetched = false // used for loading sentence cards display
let isInitialLoad = true //scrolls to first card after fetch, but won't on any more loadSentences calls
//let isFiltered = true
var helperToolsToggle = true //temp delete later
var searchTextDelayTimer //temp before timerbar delete later
var textInput = ""
var textInputEng = ""
var textInputJpn = ""
let sentencesToCreateArray = []

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
      return response.json()
    }})
  .then(function (data) {
    user = data.name[0].toUpperCase() + data.name.slice(1)
    setAuthDisp()
    // -- get functions for data that is needed on pageload after auth -- //
    getDailyTotalScoreBreakdown() 
    getSevenDayHistory()
    getLockedSentences() // gets sentences on auth automatically now
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

function reloadSentences(){
  clearSentences()
  buildSentenceCards()
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
  showElements('#dashboard-button, #log-out-button, #user-profile-dropdown, #welcome-alert-container, #user-history-container, #sentences-container, #footer')
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
    filtersContainer.scrollIntoView()
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

function buildSentenceCards() {
  const sentences = document.createDocumentFragment()
  let sentencesToCreate = filterArray(sentencesToCreateArray, filters) //use sentencesToCreateArray for different datasets
  console.log(sentencesToCreate)
  sentencesToCreate.slice(size, size+50).map(function (e, i) {
    // create card & body
    let card = document.createElement('div')
    card.classList.add('card', 'sentence-card', 'mb-5')
    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // card number
    let number = document.createElement('h4')
    number.innerHTML = `${size === 0 ? i + 1 : size + (i + 1)}`
    // new marker
    if(e.Newly_added){
      var newIcon = document.createElement('div')
      newIcon.classList.add('mb-1')
      newIcon.innerHTML = `<i class="bi bi-asterisk icon-pink ms-1"></i> NEW!!`
    }
    // set item name
    if(e.collection_item_name != undefined){
      var setItemName = document.createElement('div')
      setItemName.classList.add('mb-2', 'fs-6')
      setItemName.innerHTML = `${e.collection_item_name}`
    }
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
    modalButton.classList.add('btn', 'btn-outline-danger', 'modal-btn', 'rounded-1', 'border-4')
    modalButton.setAttribute('style', 'border-opacity: 0.5; border-width: 2px;')
    //modalButton.setAttribute('id', `${e.SentenceID}`)
    modalButton.setAttribute('id', `modal-button-${e.id}`)
    modalButton.setAttribute('data-bs-toggle', 'modal')
    modalButton.setAttribute('data-bs-target', '#exampleModal')
    modalButton.innerHTML = `<span class="fw-bold"> ${e.LevelShown} ${e.LevelShown > 1 ? 'pts' : 'pt'}!</span>`
    modalButtonContainer.appendChild(modalButton)
    
    //cardBody.appendChild(number)
    //cardBody.appendChild(gradePill)
    
    // append each element to card body
    if(newIcon) cardBody.appendChild(newIcon)
    if(setItemName) cardBody.appendChild(setItemName) //only on set cards
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
  //if (isInitialLoad) filtersContainer.scrollIntoView()
  isInitialLoad = false
  document.querySelector('#randomizeButton').classList.remove('d-none')
  size = size +50
  size >= sentencesToCreate.length ? hideElements('#see-more-sentences-container') : showElements('#see-more-sentences-container')
  sentencesToCreate.length === 0 ? showElements('#no-results-container') : hideElements('#no-results-container')
}

showMoreButton.onclick = () => {
  buildSentenceCards()
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
          //console.log(selectedFavoritedArray)
          if (selectedFavoritedArray.length > 0 ) selectedFavoriteButton.closest('.card').remove() //remove if filter is on
        }
        //clearSentences()
        //loadSentences()
      })
      .catch(function (err) {
      errorAlert('Something went wrong.', err)
	    //console.warn('Something went wrong.', err)
      }) 
}

function showKey() {
  //console.log(localStorage.getItem('authkey'))
  errorAlert(`This is the authkey: ${localStorage.getItem('authkey')}`)
}

function getLockedSentences() {
  showElements('#error-message-container, #fetching-data-loader')
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/sentences-with-auth', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    fetchedSentencesData = data  // JSON from our response saved as fetchedData
    isDatafetched = true //TODO: cache idea
    showMoreButton.classList.remove('d-none')
    hideElements('#error-message-container, #fetching-data-loader')
    showElements('#filters-container')
    loadDefaultSentences()
  })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
	showMoreButton.classList.add('d-none')
	errorAlert("Loggin to access this content")
  })    
}

function createNewFilterInput() {
  var gradeListForButtons = [...new Set(sentencesToCreateArray.map(item => item.Grade))].sort()
  var pointListForButtons = [...new Set(sentencesToCreateArray.map(item => item.Points))].sort((a, b) => a - b)
  var gramCatListForButtons = [...new Set(sentencesToCreateArray.map(item => item.Grammar_Categories[0]))].sort()
  var favoritedForButton = ['toggle favorites']
  buttonFilterContainer.innerHTML = '' //clear from dom
  createFilterButtons(gradeListForButtons,'button-filters-container', selectedGradeFiltersArray, '学習時期の目安')
  createFilterButtons(pointListForButtons,'button-filters-container', selectedPointsFiltersArray, 'リピート難易度')
  createFilterButtons(gramCatListForButtons,'button-filters-container', selectedGrammarCatArray, '関連する文法項目')
  createFilterButtons(favoritedForButton,'button-filters-container', selectedFavoritedArray, 'filter by favorited')
  createFilterTextInput()
}

function errorAlert(errMessage) {
    showElements('#error-message-container, #error-message-alert')
    errorMessageText.innerHTML = errMessage
    setTimeout(() => {
      hideElements('#error-message-container, #error-message-alert')
    }, 2000)
}

// -- filtering -- //
function filterArray(array, filters) {
  const filterKeys = Object.keys(filters)
  return array.filter(item => {
    return filterKeys.every(key => {
      if (typeof filters[key] !== 'function') return true
      return filters[key](item[key])
    })
  })
}
// arrays to store currently selected filters
let selectedGradeFiltersArray = []
let selectedPointsFiltersArray = []
let selectedGrammarCatArray = []
let selectedFavoritedArray = []
let selectedSetArray = []

function clearAllFilterArrays() {
selectedGradeFiltersArray = []
selectedPointsFiltersArray = [] 
selectedGrammarCatArray = [] 
selectedFavoritedArray = [] 
selectedSetArray = []
}

// filters to pass to filterArray function
var filters = {
  Grade: grade => selectedGradeFiltersArray.includes(grade) || selectedGradeFiltersArray.length === 0,
  Points: points => selectedPointsFiltersArray.includes(points.toLowerCase()) || selectedPointsFiltersArray.length === 0,
  Match01_by_calc: Match01_by_calc => {if (Match01_by_calc.includes(textInputEng)) return true},
  JpnPlain: JpnPlain => {if (JpnPlain.includes(textInputJpn)) return true},
  _user_sentences_addon: fav => fav[0]?.isFavorited === true && selectedFavoritedArray.includes('toggle favorites') || selectedFavoritedArray.length === 0,
  Grammar_Categories: gramCat => selectedGrammarCatArray.includes(gramCat[0]) || selectedGrammarCatArray.length === 0
}

function createFilterButtons(array, appendLocationIdString, filterTypeArray, headerName) {
  const arrayContainerFragment = document.createDocumentFragment()
  let arrayButtonsContainer = document.createElement('div')
  arrayButtonsContainer.classList.add('d-flex', 'flex-row', 'flex-wrap', 'justify-content-center', 'align-items-center', 'mb-2')
  arrayButtonsContainer.innerHTML = `<div class="w-100 mb-1 text-center fs-6 text-muted">${headerName}</div>`
  array.map(function (e, i) {
    let arrayButton = document.createElement('button')
    arrayButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'filter-btn', 'me-2', 'mb-2', 'fw-bold', 'opacity-75')
    arrayButton.setAttribute('id', `${array[i].split(' ').join('').replace('・','')}`)
    arrayButton.innerHTML = `${array[i]}`
    arrayButtonsContainer.appendChild(arrayButton) 
    arrayContainerFragment.appendChild(arrayButtonsContainer)
    arrayButton.addEventListener("click", () => addFilterToFilterListArray(e, filterTypeArray))
  })
  document.getElementById(appendLocationIdString).appendChild(arrayContainerFragment)
}

function createFilterTextInput() {
  let textInputContainer = document.createElement('div')
  textInputContainer.innerHTML = `<input id="text-search-input" class="form-control form-control-lg border-primary" type="search" placeholder="Type here in English or Japanese" aria-label="Search" oninput="textFilter();return false;">`
  buttonFilterContainer.appendChild(textInputContainer)
  textInputContainer.addEventListener("click", () => textFilter())
}

function addFilterToFilterListArray(e, filterTypeArray) {
  if (filterTypeArray.includes(e)) {
    filterTypeArray.splice(filterTypeArray.indexOf(e.toString()),1)
    console.log(e + " was found", filterTypeArray)
    document.getElementById(`${e.split(' ').join('').replace('・','')}`).classList.remove('active','opacity-100')
    document.getElementById(`${e.split(' ').join('').replace('・','')}`).innerHTML = e
  } else {
    filterTypeArray.push(e)
    console.log(e + " was pushed", filterTypeArray)
    document.getElementById(`${e.split(' ').join('').replace('・','')}`).classList.add('active', 'opacity-100')
    document.getElementById(`${e.split(' ').join('').replace('・','')}`).innerHTML = `<span>${e}  &nbsp; <i class="bi bi-x-lg"></i></span>`
  }
  reloadSentences()
}

function textFilter() {
  clearTimeout(searchTextDelayTimer)
  searchTextDelayTimer = setTimeout(function() {
    textInput = document.getElementById('text-search-input').value.toLowerCase()
    if (textInput.match(/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g)) {
      textInputEng = ''
      textInputJpn = textInput
    } else {
      textInputJpn = ''
      textInputEng = textInput
    }
    reloadSentences()
  }, 300)
}

let isSet = false

function loadCollection(collectionId, collectionName) {
  //isFiltered = false
  isSet = true
  payload = { collection_id: collectionId}
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/collection_sentences', {
    method: 'POST',
    headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') },
    body: JSON.stringify(payload)  
    })
    .then(function (response) {return response.json()})
    .then(function (data) {
      //currentSetName = data[0].collection_name
      sentencesToCreateArray = []
      data.forEach(e => sentencesToCreateArray.push(e._sentences))
      sentencesToCreateArray.forEach( (e,i) => e.collection_item_name = data[i].collection_item_name)
      document.querySelector('#collections-drop-down').innerHTML = collectionName
      clearAllFilterArrays()
      createNewFilterInput() //refresh only shows related filters
      reloadSentences()
      //showMoreButton.classList.remove('d-none')
      //hideElements('#error-message-container, #fetching-data-loader')
      //showElements('#filters-container')
      console.log(data)
    })
    .catch(function (err) {
    console.warn('Something went wrong.', err)
    showMoreButton.classList.add('d-none')
    errorAlert("Loggin to access this content")
    })    
}

function loadDefaultSentences() {
  isSet = false
  //isFiltered = true
  sentencesToCreateArray = fetchedSentencesData
  document.querySelector('#collections-drop-down').innerHTML = `All Sentences`
  clearAllFilterArrays()
  createNewFilterInput()
  reloadSentences()
}

document.querySelector('#load-all-sentences-from-collections-list').addEventListener("click", () => loadDefaultSentences()) //temp
document.querySelector('#collections-drop-down').addEventListener("click", () => getCollectionsData()) //temp
let isCollectionDataFetched = false
let collectionListArray = []

function getCollectionsData() {
  if(isCollectionDataFetched) return
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/collections', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    createCollectionsList(data)
    collectionListArray = data
    isCollectionDataFetched = true
  })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
	errorAlert("unable to get collections data")
  })    
}

function createCollectionsList(array) {
  array.map(function (e, i) {
    console.log(e)
    let collectionListItem = document.createElement('li')
    let collectionListItemLink = document.createElement('a')
    collectionListItemLink.setAttribute('id', `${e.id}`)
    collectionListItemLink.setAttribute('href', ``)
    collectionListItemLink.setAttribute('onclick', `return false;`)
    collectionListItemLink.classList.add('dropdown-item')
    collectionListItemLink.innerHTML = `${e.collection_title}`
    collectionListItemLink.addEventListener("click", () => loadCollection(e.id, e.collection_title))
    collectionListItem.appendChild(collectionListItemLink) 
    document.querySelector('#collections-list').appendChild(collectionListItem)
  })
}

document.querySelector('#load-new-sentences-from-collections-list').addEventListener("click", () => getNewSentencesData())
function getNewSentencesData() {
  //https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/new_sentences
  fetch('https://x8ki-letl-twmt.n7.xano.io/api:oZwmlDc6/new_sentences', {
  method: 'GET',
  headers: { 'Content-Type' : 'application/json', 'Authorization' : localStorage.getItem('authkey') }
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    sentencesToCreateArray = data
    document.querySelector('#collections-drop-down').innerHTML = `NEW!`
    clearAllFilterArrays()
    createNewFilterInput()
    reloadSentences()
  })
  .catch(function (err) {
	console.warn('Something went wrong.', err)
	errorAlert("unable to get collections data")
  })    
}

// -- on page load & data is requested only after auth-- //
authMe2()