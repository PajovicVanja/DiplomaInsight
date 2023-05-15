<template>
    <div>
        <h4>Delete a University</h4>
      <ul>
        <li v-for="university in universities" :key="university.id">
          {{ university.name }}
          <button @click="deleteUniversity(university.id)">Delete</button>
        </li>
      </ul>
    </div>
    <div>
        <DeleteFaculty :key="componentKey"></DeleteFaculty>
    </div>
  </template>
  
    
  <script>
  import axios from 'axios';
  import DeleteFaculty from './DeleteFaculty.vue';
  export default {
    components: {
        DeleteFaculty
    },
    data() {
      return {
        universities: [],
        componentKey: 0
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
      async deleteUniversity(id) {
        try {
          await axios.delete(`http://localhost:3000/university/${id}`);
          this.universities = this.universities.filter((university) => university.id !== id);
          this.componentKey += 1;
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  