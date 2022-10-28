// -- chart data -- //

//chart one: last 7 day total points
let chartOneLableData = []
let chartOneChartData = []

const chartOneData = {
  labels: chartOneLableData,
  datasets: [{
    label: 'Daily Total Score',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: chartOneChartData,
  }]
}

const chartOneConfig = {
  type: 'line',
  data: chartOneData,
  options: {
    animation:{
      duration: 0
    }
  }
}

// chart 2: daily breakdown points per level
//let chartTwoChartData = [1,2,3,4,0,0,7,8,0,50]
let chartTwoChartData = [0,0,0,0,0,0,0,0,0,0]

const chartTwoData = {
  labels: ["Level One","Level Two","Level Three","Level Four","Level Five","Level Six","Level Seven","Level Eight","Level Nine","Level Ten",],
  datasets: [{
    label: 'daily breakdown by points per level',
    backgroundColor: [ 
      '#D6E6B3',
      '#C8DE9C',
      '#A7D685',
      '#8ACC66',
      '#73BF40',
      '#65AC39',
      '#4B9532',
      '#327A29',
      '#246B31',
      '#1C5425'],
    //borderColor: 'rgb(255, 99, 132)',
    data: chartTwoChartData,
  }]
}

const chartTwoConfig = {
  type: 'doughnut',
  data: chartTwoData,
  options: {
    animation:{
      duration: 0
    }
  }
}

// chart 3: daily breakdown number of correctly repeated phrases by level
let chartThreeChartData = [0,0,0,0,0,0,0,0,0,0]

const chartThreeData = {
  labels: ["1 point","2 points","3 points","4 points","5 points","6 points","7 points","8 points","9 points","10 points"],
  datasets: [{
    label: 'daily breakdown by points per level',
    backgroundColor: [ 
      '#F6E4F2',
      '#FBF4F4',
      '#F6E4EB',      
      '#EECDE9',
      '#D3B6E7',
      '#AE9FDF',      
      '#A594DB',
      '#9E85D6',
      '#9575D1',
      '#8C62CB'],
    //borderColor: 'rgb(255, 99, 132)',
    data: chartThreeChartData,
  }]
}

const chartThreeConfig = {
  type: 'doughnut',
  data: chartThreeData,
  options: {
    animation:{
      duration: 0
    }
  }
}