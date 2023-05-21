<template>
    <div class="register-container">
    <h2>Register</h2>
    <form class="register-form" @submit.prevent="register">
      <input class="input-field" type="text" placeholder="Name" v-model="name" />
      <input class="input-field" type="email" placeholder="Email" v-model="email" />
      <input class="input-field" :class="{ 'red': isPasswordShort, 'green': !isPasswordShort  }" type="password" placeholder="Password (minimum 3 characters)" v-model="password" />
      <div class="centering">
        <button class="submit-btn" :class="{ 'move-right': isPasswordShort && buttonPosition === 'right', 'move-left': isPasswordShort && buttonPosition === 'left' }" @mouseover="moveButton" type="submit">Register</button>
      </div>
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
      password: '',
      isPasswordShort: false,
      buttonPosition: 'center' 

    }
  },
  watch: {
    password(newVal) {
      this.isPasswordShort = newVal.length < 3;
      if(!this.isPasswordShort){
        this.buttonPosition = 'center'; 
      }
    }
  },
  methods: {
    
    async register() {
      if (!this.isPasswordShort) {
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
    },
    moveButton() {
      if(this.isPasswordShort) {
        this.buttonPosition = this.buttonPosition === 'right' ? 'left' : 'right';
      }
    },
  }
}
</script>

<style src="../css/Register.css" scoped></style>
