import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

export default ({ store }, inject) => {
  Vue.use(VueNativeSock, 'ws://localhost:2136', {
    json: true,
    format: 'json',
    passToStoreHandler: function (eventName, event) {
      if (!eventName.startsWith('SOCKET_')) { return }
      let method = 'commit'

      let target = eventName.toUpperCase()
      let msg = event

      if (this.format === 'json' && event.data) {
        msg = JSON.parse(event.data)
        if (msg.mutation) {
          target = [msg.namespace || '', msg.mutation].filter((e) => !!e).join('/')
        } else if (msg.action) {
          method = 'dispatch'
          target = [msg.namespace || '', msg.action].filter((e) => !!e).join('/')
        }
      }
      this.store[method](target, msg.data)
    },
    store
  })
}
