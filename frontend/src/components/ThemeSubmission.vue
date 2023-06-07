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
      dispositionId: null,  
      disposition: null,  
      candidateId: '',
      comment: '',
      mentorId: '',
      themeStatus:'',
      mentors: [],
    };
  },

  async created() {
      try {

        
        axios.defaults.withCredentials = true;
        const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
        this.candidateId = response.data.id;
  
        const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/${this.candidateId}`);
        const disposition = dispositionResponse.data.status;
        this.dispositionId = dispositionResponse.data.id; 

        this.fetchDispositionStatus(response.data.id);
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
      fetchDispositionStatus(id) {
      if (this.candidateId !== null) {
        axios.get(`https://diplomainsight.onrender.com/disposition/status/${id}`)
          .then(response => {
            this.themeStatus = response.data.currentThemeStatus;
          })
          .catch(error => {
            console.error('Error fetching disposition status:', error);
          });
      }
    },
      async submitDissertationTheme() {

        if (this.themeStatus && this.themeStatus !== 'Theme Declined') {
      alert('You have already submitted a theme.');
      return;
    }
  const formData = new FormData();
  formData.append('dissertationTheme', this.dissertationTheme);
  formData.append('candidateId', this.candidateId);

  try {
    const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/${this.candidateId}`);
    this.dispositionId = dispositionResponse.data.id; 
    const response = await axios.post(`https://diplomainsight.onrender.com/disposition/submitTheme/${this.dispositionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert(response.data.message);
    this.fetchDispositionStatus(this.candidateId);

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