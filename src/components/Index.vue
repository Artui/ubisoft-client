<template>
  <div>
    <div>
      <v-btn :to="{name: 'Player'}" class="player">Player</v-btn>
      <v-btn :to="{name: 'Moderator'}" class="moderator">Moderator</v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data () {
    return {}
  }
}
</script>
