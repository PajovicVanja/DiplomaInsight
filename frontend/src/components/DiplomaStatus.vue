<template>
    <div>
      <h1>Your Thesis</h1>
  
      <div v-for="disposition in submitted" :key="disposition.id" class="disposition-container">
        <div>
          <h3>Thesis ID: {{ disposition.id }}</h3>
          <h3>Mentor: {{ disposition.mentorId }}</h3>
          <h3>Status: {{ disposition.progressStatus }}</h3>
          <h3>Next Deadline: {{ formatDeadline(disposition.deadline) }}</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userId: '',
        submitted: [],
        selectedFile: null,
      };
    },
    async created() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3000/profile/current');
        this.userId = response.data.id;
        console.log(this.userId);
  
        const submittedResponse = await axios.get(`http://localhost:3000/disposition/diploma-status/current-user/${this.userId}`);
        this.submitted = submittedResponse.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
        formatDeadline(deadline) {
    if (deadline) {
      const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return formattedDeadline;
    }
    return 'N/A'; // If no deadline is set, display "N/A"
  },
    },
  };
  </script>
  
  <style scoped src="../css/SubmittedDispositions.css"></style>
  