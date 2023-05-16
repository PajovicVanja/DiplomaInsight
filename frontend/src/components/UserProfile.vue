<template>
    <div>
      <h2>User Profile</h2>
      
      <form @submit.prevent="updateProfile">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="user.name">
        
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email">
        
        <button type="submit">Update Profile</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {
          name: '',
          email: ''
        }
      };
    },
    async created() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3000/profile/current');
        this.user = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      async updateProfile() {
        try {
          axios.defaults.withCredentials = true;
          await axios.put('http://localhost:3000/profile/current', this.user);
          alert('Profile updated successfully');
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  </script>
  