import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app'
import user from '@/store/user'
import getters from '@/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app
  },
  getters
})
