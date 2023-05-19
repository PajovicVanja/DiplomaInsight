<template>
  <div class="form-wrapper">
    <form @submit.prevent="submitForm" class="form-section">
      <label for="name" class="form-label">University Name:</label>
      <input type="text" id="name" v-model="university.name" class="form-input">
      <label for="location" class="form-label">Location</label>
      <input type="text" id="location" v-model="university.location" class="form-input">
      <button type="submit" class="form-button">Add University</button>
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
  <style src="../css/UniversityForm.css" scoped></style>