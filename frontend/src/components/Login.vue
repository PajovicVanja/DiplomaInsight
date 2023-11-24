<template>
   <div class="login-container">
    <h2 >Login</h2>
    <form class="login-form" @submit.prevent="login">
      <input class="input-field" type="email" placeholder="Email" v-model="email" />
      <input class="input-field" type="password" placeholder="Password" v-model="password" />
      <button class="submit-btn" type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {

    const loginData = {
      email: this.email,
      password: this.password
    };

    axios.post('http://localhost:3000/login', loginData, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          this.$emit('user-logged-in');
        }
      })
      .catch(error => {
        if (error.response) {
          alert(error.response.data);
        } else {
          console.error('Error:', error);
        }
      });
  }
  }
}

</script>

<style src="../css/Login.css" scoped></style>



