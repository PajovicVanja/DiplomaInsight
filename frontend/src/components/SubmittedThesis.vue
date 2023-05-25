<template>
    <div>
      <h1>Submitted Thesis</h1>
  
      <div v-for="disposition in submitted" :key="disposition.id" class="disposition-container">
        <div>
          <h3>Candidate ID: {{ disposition.candidateId }}</h3>
          <h3>Status: {{ disposition.progressStatus }}</h3>
          <select v-model="disposition.progressStatus" @change="updateDispositionStatus(disposition)">
            <option value="Thesis Reviewed">Thesis Reviewed</option>
            <option value="Thesis Defended">Thesis Defended</option>
            <option value="Diploma Issued">Diploma Issued</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        mentorId: '',
        submitted: [], // Holds the list of submitted dispositions
        selectedFile: null, // Holds the selected file
      };
    },
    async created() {
      try {
        // Fetch the current user's ID
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3000/profile/current');
        this.mentorId = response.data.id;
        console.log(this.mentorId);
  
        // Fetch submitted dispositions with theme status "Theme Submitted" for the mentorId
        const submittedResponse = await axios.get(`http://localhost:3000/disposition/diploma-status/thesis-submitted/${this.mentorId}`);
        this.submitted = submittedResponse.data;
        console.log(submittedResponse);
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      async updateDispositionStatus(disposition) {
        try {
          const response = await axios.put(`http://localhost:3000/disposition/updateProgress/${disposition.id}`, {
            candidateId: disposition.candidateId,
            mentorId: disposition.mentorId,
            progressStatus: disposition.progressStatus,
          });
          console.log(response.data.message);
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped src="../css/SubmittedDispositions.css"></style>
  