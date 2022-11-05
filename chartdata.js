// -- chart data -- //
const plugin = {
  id: 'no-data',
  afterDraw: function(chart) {
  	if (chart.data.datasets.length === 0) {
    	// No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height
      chart.clear();
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText('No data to display', width / 2, height / 2);
      ctx.restore();
    }
  }
}

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
let chartTwoChartData = [0,0,0,0,0,0,0,0,0,0]
const chartTwoData = {
  labels: [
    "難易度１",
    "難易度２",
    "難易度３",
    "難易度４",
    "難易度５",
    "難易度６",
    "難易度７",
    "難易度８",
    "難易度９",
    "難易度１０"],
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
    },
    plugins: [plugin]
  }
}

// chart 3: daily breakdown number of correctly repeated phrases by level
let chartThreeChartData = [0,0,0,0,0,0,0,0,0,0]
const chartThreeData = {
  labels:  [
    "難易度１",
    "難易度２",
    "難易度３",
    "難易度４",
    "難易度５",
    "難易度６",
    "難易度７",
    "難易度８",
    "難易度９",
    "難易度１０"],
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