<template>
  <div class="login-container">
    <h2>Login</h2>
    <form class="login-form" @submit.prevent="login">
      <input 
        class="input-field" 
        type="email" 
        placeholder="Email" 
        v-model="email" 
      />
      <input 
        class="input-field" 
        type="password" 
        placeholder="Password" 
        v-model="password" 
      />
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
async login() {
  try {
    const response = await axios.post(
      'https://diplomainsight.onrender.com/login',
      {
        email: this.email,
        password: this.password
      },
      { withCredentials: true }
    );

    if (response.status === 200) {
      // 🔥 JAVIMO App.vue DA JE LOGIN USPJEŠAN
      this.$emit('user-logged-in');

      // 🔥 SAKRIJ LOGIN FORMU (pošalji event roditelju)
      this.$emit('hide-form');
    }

  } catch (error) {
    if (error.response) {
      alert(error.response.data);
    } else {
      console.error('Error:', error);
    }
  }
}

  }
}
</script>

<style src="../css/Login.css" scoped></style>
