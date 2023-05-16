<template>
        <UniversityForm @university-added="getUniversities" />
    <form @submit.prevent="submitForm">
      <label for="name">Faculty Name:</label>
      <input type="text" id="name" v-model="faculty.name">
      
      <label for="university_id">University:</label>
      <select v-model="faculty.university_id">
        <option v-for="university in universities" :key="university.id" :value="university.id">
          {{ university.name }}
        </option>
      </select>
      
      <button type="submit">Add Faculty</button>
    </form>

    <study-program-form :key="componentKey"></study-program-form>

  </template>
  
  <script>
  import axios from 'axios';
  import StudyProgramForm from './StudyProgramForm.vue';

  export default {
    components: {
      StudyProgramForm,
    },
    data() {
      return {
        faculty: {
          name: '',
          university_id: '',
        },
        universities: [],
        componentKey: 0,
      };
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:3000/university');
        this.universities = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
        getUniversities() {
        axios.get('http://localhost:3000/university')
        .then(response => {
            this.universities = response.data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
      async submitForm() {
        try {
          await axios.post('http://localhost:3000/faculty/create', this.faculty);
          this.faculty.name = '';
          this.faculty.university_id = '';
          this.componentKey += 1; 
          alert('Faculty added successfully!');
        } catch (error) {
          console.error(error);
        }
      },
      
    },
  };
  </script>
  