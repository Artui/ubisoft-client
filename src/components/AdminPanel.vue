<template>
  <div>
    <v-btn :to="{name: 'Index'}">Home</v-btn>
    Get player by coordinates
    <form @submit.prevent="getUser()">
      <div class="container">
        <label for="">Column:</label>
        <input v-model="player_search.column" type="number">
      </div>
      <div class="container">
        <label for="">Row:</label>
        <input v-model="player_search.row" type="number">
      </div>
      <button type="submit" id="button">Search</button>
    </form>
    <div>{{errors}}</div>
    <v-btn class="clear" v-on:click="clearUser">Clear User</v-btn>
    <div v-if="player">
      Player [{{player.column}}, {{player.row}}]
      <div v-for="(task, index) in constructTasks(player.tasks)" :key="task">
        <li>
          {{task}}
          <v-btn v-on:click="clearTask(index)">Stop Task</v-btn>
        </li>
      </div>
      <v-btn v-if="playerTasks" v-on:click="addTask">Add Task</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Moderator',
  data () {
    return {
      player_search: {row: '', column: ''},
      player: '',
      updating: false,
      errors: ''
    }
  },
  mounted () {
    this.$forceUpdate()
    setInterval(function () {
      this.$forceUpdate()
    }.bind(this), 700)
  },
  computed: {
    playerTasks () {
      return this.player.tasks.length < 4
    }
  },
  methods: {
    getUser () {
      this.clearUser()
      let params = this.player_search
      this.$http.get('/game/player/', {params: params}).then(response => {
        this.errors = ''
        this.updating = true
        this.player = response.data.player
        this.$forceUpdate()
        this.reloadData()
        setInterval(function () {
          this.reloadData()
        }.bind(this), 2000)
      }).catch((errors) => {
        this.errors = errors.body
        this.player = ''
        this.updating = false
        this.$forceUpdate()
      })
    },
    reloadData () {
      if (this.updating) {
        let params = {row: this.player.row, column: this.player.column}
        this.$http.get('/game/player/', {params: params}).then(response => {
          this.errors = ''
          this.player = response.data.player
          this.$forceUpdate()
        }).catch((errors) => {
          this.errors = errors.body
          this.player = ''
          this.updating = false
          this.$forceUpdate()
        })
      }
    },
    constructTimer (milliseconds) {
      let seconds = milliseconds / 1000
      if (seconds > 0) {
        return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`
      } else {
        return null
      }
    },
    constructTasks (tasks) {
      let set = []
      let index = 1
      tasks.forEach((task) => {
        let taskTime = this.constructTimer(new Date(task) - new Date(Date.now() + new Date().getTimezoneOffset() * 60000))
        if (taskTime != null) {
          set.push(`Task ${index} -  ` + taskTime + ' left; ')
          index += 1
        }
      })
      return set
    },
    clearTask (index) {
      let data = this.player
      data.task = index
      this.$http.put('/game/stop/', data).then(response => {
        this.reloadData()
        setInterval(function () {
          this.reloadData()
        }.bind(this), 2000)
        this.$forceUpdate()
      }).catch((errors) => {
        this.errors = errors.body
        this.player = ''
        this.updating = false
        this.$forceUpdate()
      })
    },
    addTask () {
      let data = this.player
      this.$http.put('/game/start/', data).then(response => {
        this.reloadData()
        this.$forceUpdate()
      }).catch((errors) => {
        this.errors = errors.body
        this.player = ''
        this.updating = false
        this.$forceUpdate()
      })
    },
    clearUser () {
      this.updating = false
      this.player = ''
      this.errors = ''
      this.$forceUpdate()
    }
  }
}
</script>
<style>
  .player {
    width: 100%;
    height: 3rem;
    text-align: center;
  }
</style>
