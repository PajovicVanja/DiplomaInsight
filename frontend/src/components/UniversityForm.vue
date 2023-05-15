<template>
    <div>
      <form @submit.prevent="submitForm">
        <label for="name">University Name:</label>
        <input type="text" id="name" v-model="university.name">
        <input type="text" id="name" v-model="university.location">
        <button type="submit">Add University</button>
      </form>
      
      <faculty-form :key="componentKey"></faculty-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import FacultyForm from './FacultyForm.vue';
  
  export default {
    components: {
      FacultyForm,
    },
    data() {
      return {
        university: {
          name: '',
          location: '',
        },
        componentKey: 0,
      };
    },
    methods: {
      async submitForm() {
        try {
          await axios.post('http://localhost:3000/university/create', this.university);
          this.university.name = '';
          this.university.location = '';
          this.componentKey += 1; 
          alert('University added successfully!');
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  