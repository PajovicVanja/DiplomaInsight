<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Login</button>
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
      console.log('Login method called'); // Add this

      const loginData = {
        email: this.email,
        password: this.password
      };

      axios.post('http://localhost:3000/login', loginData, { withCredentials: true })
        .then(response => {
          console.log('Response:', response);
          if (response.status === 200) {
            this.$emit('user-logged-in');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}

</script>
