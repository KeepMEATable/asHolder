<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3 v-if="$store.state.waitingLine.waitingLines.length">
      <v-list-tile v-for="item in $store.state.waitingLine.waitingLines" :key="item.customerId">
        <v-list-tile-avatar>
           <v-icon color="teal" @click="$store.dispatch('waitingLine/ready', item)">add_alert</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-html="item.customerId"></v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
            <v-icon color="red" @click="$store.dispatch('waitingLine/reset', item)">remove_circle</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-flex>
    <v-flex xs12 sm6 offset-sm3 v-else>
      <v-icon class="wb_sunny" color="orange">wb_sunny</v-icon>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SelectNumber extends Vue {
  public created() {
    this.$store.dispatch('waitingLine/init');
  }
}
</script>

<style scoped=true>
  .wb_sunny {
    font-size: 30vmin;
  }
</style>
