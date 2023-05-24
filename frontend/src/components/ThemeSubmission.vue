<template>
    <div>
      <h1>Theme Submission</h1>
  
      <div v-if="isDispositionApproved">
        <p>Your disposition has been approved. Please upload your dissertation theme:</p>
  
        <input type="file" id="dissertationTheme" @change="onFileChange" required>
        <button @click="submitDissertationTheme">Submit</button>
      </div>
  
      <div v-else-if="isDispositionDisapproved">
        <p>Your disposition has been disapproved. Please make the necessary revisions and resubmit.</p>
      </div>
  
      <div v-else>
        <p>Your disposition is pending approval.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        isDispositionApproved: false,
        isDispositionDisapproved: false,
        dissertationTheme: null,
        candidateId: '', // This will be set by the current user's id
        dispositionId: '' // This will be set by the current disposition's id
      };
    },
    async created() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('http://localhost:3000/profile/current');
        this.candidateId = response.data.id;
  
        // Check the status of the disposition here and update the flags accordingly
        const dispositionResponse = await axios.get(`http://localhost:3000/disposition/${this.candidateId}`);
        const disposition = dispositionResponse.data.status;
        this.dispositionId = dispositionResponse.data.id; // Get the disposition ID
        if (disposition === 'Disposition Approved') {
          this.isDispositionApproved = true;
        } else if (disposition === 'Disposition Disapproved') {
          this.isDispositionDisapproved = true;
        }
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      onFileChange(e) {
        this.dissertationTheme = e.target.files[0];
      },
      async submitDissertationTheme() {
  const formData = new FormData();
  formData.append('dissertationTheme', this.dissertationTheme);
  formData.append('candidateId', this.candidateId);

  try {
    // Check the status of the disposition here and update the flags accordingly
    const dispositionResponse = await axios.get(`http://localhost:3000/disposition/${this.candidateId}`);
    this.dispositionId = dispositionResponse.data.id; // Get the disposition ID
    console.log('opp '+ dispositionResponse.data.id)
    const response = await axios.post(`http://localhost:3000/disposition/submitTheme/${this.dispositionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert(response.data.message);
  } catch (error) {
    console.error(error);
    alert('An error occurred while submitting your dissertation theme.');
  }
}

    }
  };
  </script>
  