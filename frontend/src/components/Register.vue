<template>
    <div class="register-container">
    <h2>Register</h2>
    <form class="register-form" @submit.prevent="register">
      <input class="input-field" type="text" placeholder="Name" v-model="name" />
      <input class="input-field" type="email" placeholder="Email" v-model="email" />
      <input class="input-field" type="password" placeholder="Password" v-model="password" />
      <button class="submit-btn" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserRegister',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style src="../css/Register.css" scoped></style>
