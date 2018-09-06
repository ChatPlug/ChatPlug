import {Pie} from 'vue-chartjs'

export default Pie.extend({
  mounted () {
    this.renderChart({
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          backgroundColor: [
            'rgba(65, 184, 131, .8)',
            'rgba(228, 102, 81, .8)',
            'rgba(0, 216, 255, .8)',
            'rgba(155, 89, 182, .8)'
          ],
          borderWidth: 0,
          data: [40, 20, 80, 10]
        }
      ]
    }, {responsive: true, maintainAspectRatio: false})
  }
})