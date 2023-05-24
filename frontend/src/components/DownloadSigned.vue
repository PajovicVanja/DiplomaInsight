<template>
    <div>
      <h1>Accepted Themes</h1>
      <div v-for="theme in acceptedThemes" :key="theme.id">
        
        <div>
          <button @click="downloadTheme(theme.id)">Download Theme</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        acceptedThemes: [],
      };
    },
    async created() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3000/profile/current');
        const candidateId = response.data.id;

        const themeResponse = await axios.get(`http://localhost:3000/disposition/accepted-themes/${candidateId}`);
        this.acceptedThemes = themeResponse.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      downloadTheme(themeId) {
        window.open(`http://localhost:3000/disposition/download-themeSigned/${themeId}`);
      },
    },
  };
  </script>
  