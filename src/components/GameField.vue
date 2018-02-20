<template>
  <div id="container">
    <v-btn :to="{name: 'Index'}">Home</v-btn>
    <div id="bottom-left-x-y">{{ bottom.left }}</div>
    <div id="bottom-right-x-y">{{ bottom.right }}</div>
    <table id="table">
      <td v-for="item in rows" :key="item">
        <tr v-for="el in item" :key="el">
          <th v-bind:class="el[0] + '-' + el[1]">
          </th>
        </tr>
      </td>
    </table>
    <div id="top-left-x-y">{{ top.left }}</div>
    <div id="top-right-x-y">{{ top.right }}</div>
    <div id="players">
      Players
      <ol v-for="player in players" :key="player">
        <ul>Player [{{ player.column}}, {{ player.row }}]: {{ constructTasks(player.tasks) }} </ul>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameField',
  data () {
    this.elems = []
    for (let i = 0; i < 32; i++) {
      let temp = []
      for (let j = 0; j < 32; j++) {
        temp.push([j, i])
      }
      this.elems.push(temp)
    }
    return {
      rows: this.elems,
      players: [],
      top: {left: [0, 31], right: [31, 31]},
      bottom: {left: [0, 0], right: [31, 0]}
    }
  },
  mounted () {
    this.loadData()

    setInterval(function () {
      this.loadData()
    }.bind(this), 700)
  },
  created () {
    window.addEventListener('keypress', (event) => {
      this.moveField(event.which)
    })
    this.updateTimer()
    setInterval(function () {
      this.updateTimer()
    }.bind(this), 500)
  },
  methods: {
    playerClass (className) {
      var doc = document.getElementsByClassName(className).item(0)
      if (doc.style.background !== 'yellowgreen') {
        doc.style.background = 'yellowgreen'
      } else {
        doc.style.background = 'white'
      }
    },
    moveField (buttonNumber) {
      /*
      100 = d
      97 = a
      119 = w
      115 = s
       */
      switch (buttonNumber) {
        case 100:
          if (this.top.right[1] !== 511) {
            this.move(0, 1)
          }
          this.$forceUpdate()
          break
        case 97:
          if (this.top.left[0] !== 0) {
            this.move(0, -1)
          }
          this.$forceUpdate()
          break
        case 115:
          if (this.top.right[1] !== 511) {
            this.move(1, 1)
          }
          this.$forceUpdate()
          break
        case 119:
          if (this.bottom.left[1] !== 0) {
            this.move(1, -1)
          }
          this.$forceUpdate()
          break
      }
      this.loadData()
    },
    move (axis, direction) {
      this.top.left[axis] += direction
      this.top.right[axis] += direction
      this.bottom.left[axis] += direction
      this.bottom.right[axis] += direction
    },
    loadData () {
      this.$http.get('/game/players/', {params: {top: this.top.right.toString(), bottom: this.bottom.left.toString()}}).then(response => {
        this.players = response.data.players
        this.resetBgStyles()
        this.paintPlayers(response.data.players)
        this.$forceUpdate()
      }).catch((errors) => {
      })
    },
    resetBgStyles () {
      for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
          let className = document.getElementsByClassName(`${i}-${j}`).item(0)
          className.style.background = 'white'
        }
      }
    },
    paintPlayers (players) {
      players.forEach((player) => {
        let x = player.row - this.bottom.left[1]
        let y = player.column - this.bottom.left[0]
        let className = document.getElementsByClassName(`${x}-${y}`).item(0)
        className.style.background = 'yellowgreen'
      })
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
      let text = ''
      let index = 1
      tasks.forEach((task) => {
        let taskTime = this.constructTimer(new Date(task) - new Date(Date.now() + new Date().getTimezoneOffset() * 60000))
        if (taskTime != null) {
          text += `Task ${index} -  ` + taskTime + ' left; '
          index += 1
        }
      })
      return text
    },
    updateTimer () {
      this.$forceUpdate()
    }
  }
}
</script>

<style>
  #players {
    text-align: left;
    position: absolute;
  }
  #players ul{
    text-align: left;
  }
  #top-left-x-y {
    position: absolute;
    left: 20%;
  }
  #top-right-x-y {
    position: absolute;
    right: 20%;
  }
  #bottom-left-x-y {
    position: absolute;
    left: 20%;
  }
  #bottom-right-x-y {
    position: absolute;
    right: 20%;
  }
  #container {
    position: relative;
  }
  #table {
    margin-left: 25%;
    border: 2px solid;
    background-color: white;
    border-spacing: 1px;
  }

  th {
    background-color: transparent;
    border: 1px black solid;
    padding: 10px 10px;
  }
  td {
    padding: 0px;
  }
</style>
