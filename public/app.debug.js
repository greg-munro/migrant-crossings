/* global enigma schema Filter include Hypercube PieOne app Chart */  
/* global Chart render */

class PieOne {
  constructor (elementId, options) {
    const DEFAULT = {}
    this.elementId = elementId
    this.options = Object.assign({}, options)
    const el = document.getElementById(this.elementId)
    const config = {
      type: 'pie',
      options: {}
    }
    this.pieOne = new Chart(
      document.getElementById('pie-1'),
      config
    )
    this.render()
  }
        
  render () {
    this.options.model.getLayout().then(layout => {
      const data = {
        labels: [],
        datasets: [{
          label: 'Deaths',
          backgroundColor: 'rgb(43, 144, 201)',
          borderColor: 'rgb(255, 255, 255)',
          data: []
        }]
      }
      layout.qHyperCube.qDataPages[0].qMatrix.forEach(row => {
        data.labels.push(row[0].qText)
        data.datasets[0].data.push(row[1].qNum)
      })
      this.pieOne.data = data 
      this.pieOne.update()
    })
  }
}


const session = enigma.create({
  schema,
  url: 'wss://ec2-3-92-185-52.compute-1.amazonaws.com/anon/app/6bb2c4a8-4328-46d5-88e1-747870f4e1d2'
})

session.open().then(global => {
  global.openDoc('6bb2c4a8-4328-46d5-88e1-747870f4e1d2').then(app => {
    console.log(app)

    const def = {
      qInfo: {
        qType: 'pie-test'
      },
      qHyperCubeDef: {
        qDimensions: [
          { qDef: { qFieldDefs: ['Details'] } }
        ],
        qMeasures: [
          { qDef: { qDef: `Sum({$<Details = {"Deaths recorded in Central Med"}>}Count)`, qLabel: 'Deaths' } }
        ],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 3,
            qHeight: 3
          }]
      }
    }
    app.createSessionObject(def).then(model => {
      const TestOne = new PieOne('pie-1', { model })
      console.log(TestOne)
    })
  })
})
