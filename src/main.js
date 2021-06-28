import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isStarted: true,
    scores: [],
    user: '',
    turn: 'right',
    shouldCalculate: false,
    objects: [],
    result: {
      bending: 0,
      leftMomentum: 0,
      rightMomentum: 0
    }
  },
  mutations: {
    start(state) {
      state.isStarted = true
    },
    stop(state) {
      state.isStarted = false
    },
    saveScore(state, score) {
      state.scores.push(score)
    },
    saveUser(state, user) {
      state.user = user
    },
    updateTurn(state, newTurn) {
      state.turn = newTurn
    },
    calculate(state, shouldCalculate) {
      state.shouldCalculate = shouldCalculate
    },
    setObjectPositions(state, singleObj) {
      state.objects.push(singleObj)
    },
    setResult(state, result) {
      state.result = result
    },
    resetStore(state) {
      state.isStarted = true
      state.scores = []
      state.user = ''
      state.turn = 'right'
      state.shouldCalculate = false
      state.objects = []
      state.result.bending = 0
      state.result.leftMomentum = 0
      state.result.rightMomentum = 0
    }
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')