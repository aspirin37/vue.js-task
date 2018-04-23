<template>
  <div class="sockets container text-left">
    <div class="d-flex justify-content-center">
      <router-link :to="{ path: 'fractions-calculator' }" class="sockets__link text-dark">
        TO FRACTIONS CALCULATOR
      </router-link>
    </div>

    <ol class="sockets__list">
      <li class="sockets__item d-flex justify-content-center" v-for="(comment, i) in comments">
        <span class="sockets__text">{{ comment }}</span>
        <button class="sockets__btn btn btn-sm btn-primary" type="button" @click="sendRequestForDeletion(i)">Удалить</button>
      </li>
    </ol>
  </div>
</template>

<script>

export default {
  name: 'WebSockets',
  data () {
    return {
      ws: '',
      comments: [
        'Комментарий 1',
        'Комментарий 2',
        'Комментарий 3',
        'Комментарий 4',
        'Комментарий 5',
        'Комментарий 6',
        'Комментарий 7',
        'Комментарий 8',
        'Комментарий 9',
        'Комментарий 10'
      ]
    }
  },
  methods: {
    sendRequestForDeletion (idx) {
      this.ws.send(idx);
    },
    deleteComment (idx) {
      this.comments.splice(idx, 1)
    },
    setWebSocketConnection() {
      const url = 'ws://echo.websocket.org/'
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('connected to ' + url);
      }

      this.ws.onclose = () => {
        this.setWebSocketConnection()
      }

      this.ws.onmessage = (evt) => {
        this.deleteComment(evt.data)
      }

      this.ws.onerror = (evt) => {
        console.log("error: " + evt)
      }
    }
  },
  created () {
    this.setWebSocketConnection()
  }
}
</script>

<style scoped lang="sass">
  .sockets__item
    margin-bottom: 10px

  .sockets__text
    width: 400px

  .sockets__link
    margin-right: 10px
    margin-bottom: 30px
    text-decoration: underline
    cursor: pointer

</style>
