import Vue from 'vue'
import Router from 'vue-router'
import FractionsCalculator from '@/components/fractions-calculator'
import Sockets from '@/components/sockets'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'FractionsCalculator',
      component: FractionsCalculator
    }, {
      path: '/sockets',
      name: 'Sockets',
      component: Sockets
    }]
})
