import Vue from 'vue'
import Router from 'vue-router'
import FractionsCalculator from '@/components/fractions-calculator'
import WebSockets from '@/components/web-sockets'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/fractions-calculator',
      name: 'FractionsCalculator',
      component: FractionsCalculator
    }, {
      path: '/web-sockets',
      name: 'WebSockets',
      component: WebSockets
    }]
})
