<template>
  <div class="login">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" label="Name" :rules="notEmptyRule" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn @click="validate()" :disabled="!valid">
        Log in
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
  name = '';
  password = '';
  valid = true;
  notEmptyRule = [
    v => !!v || 'cannot be empty'
  ];
  validate () {
    if (this.$refs.form.validate()) {
      this.$store.dispatch('authentication/login', {
        name: this.name,
        password: this.password
      })
    }
  }
}
</script>
