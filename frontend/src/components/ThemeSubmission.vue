<template>
  <div class="theme-submission-container">
    <h1>Theme Submission</h1>
    <div class="theme-submission-group">
        <input type="file" id="dissertationTheme" class="theme-submission-input" @change="onFileChange" required>
        <button class="theme-submission-btn" @click="submitDissertationTheme">Submit</button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      dispositionId: null,  // Initialize it
      disposition: null,  // Initialize it
      candidateId: '',
      comment: '',
      mentorId: '',
      mentors: [],
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
<style scoped>.theme-submission-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 1em;
}

h1 {
  color: #444;
  font-size: 2em;
  text-align: center;
  margin-bottom: 1em;
}

.theme-submission-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;
}

.theme-submission-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 1em;
}

.theme-submission-btn {
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  background-color: #4881A0;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.theme-submission-btn:hover {
  background-color: #366873;
}

@media (max-width: 768px) {
  .theme-submission-container {
    padding: 1em;
  }
}

</style>