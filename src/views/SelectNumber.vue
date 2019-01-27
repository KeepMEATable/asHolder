<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-list-tile v-for="item in $store.state.queues" :key="item.customerId" v-if="item.waiting">
        <v-list-tile-avatar>
           <v-icon color="teal" @click="$store.dispatch('ready', item)">add_alert</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title v-html="item.customerId"></v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
            <v-icon color="red" @click="$store.dispatch('reset', item)">remove_circle</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SelectNumber extends Vue {
  public created() {
    this.$store.dispatch('init');
  }
}
</script>
