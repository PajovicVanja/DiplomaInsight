<template>
  <div v-if="theme.progressStatus == null" class="theme-container">
    <h3 class="start-deadline">Start deadline information</h3>
    <button class="status-button" @click="updateProgressionStatus">I have handed documents to faculty</button>
  </div>
  <div class="parent">
    <div v-if="theme.progressStatus != null">
      <h1>Your theme</h1>
      <div style="text-align: center;" v-for="disposition in submitted" :key="disposition.id"
        class="disposition-container">
        <div>
          <h3>Thesis ID: {{ disposition.id }}</h3>
          <h3>Mentor: {{ this.mentorName }}</h3>
          <h3>Status: {{ disposition.progressStatus }}</h3>
          <div v-if="!loading">
            <h3>Defending: {{ theme.defending }}</h3>
          </div>
          <div v-if="!loading">
            <h3>Deadline: {{ formatDeadline(disposition.deadline) }}</h3>
          </div>

        </div>
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
      theme: {
        id: "",
        candidateId: "",
        mentorId: "",
        dispositionPath: "",
        progressStatus: "",
        deadline: "",
        defending: "",
      },
      mentorName: '',
      loading: true,


    };
  },
  async created() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
      this.userId = response.data.id;

      const submittedResponse = await axios.get(`https://diplomainsight.onrender.com/status/diploma-status/current-user/${this.userId}`);
      this.submitted = submittedResponse.data;

      const themeResponse = await axios.get(`https://diplomainsight.onrender.com/status/accepted-themes/${this.userId}`);
      this.theme = themeResponse.data[0];

      const mentorsResponse = await axios.get(`https://diplomainsight.onrender.com/status/mentorName/${this.theme.mentorId}`);
      this.mentorName = mentorsResponse.data.name;

      this.formatDefending(this.theme.defending);

      this.loading = false;


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
      return 'N/A'; 
    },
    formatDefending(defending) {
      if (defending) {
        const formattedDefending = new Date(defending).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        this.theme.defending = formattedDefending;

        return formattedDefending;
      }  else if (defending == null){
        this.theme.defending = 'N/A';
      } else{
        this.theme.defending = 'N/A';
      } 
      return 'N/A';
    },
    async updateProgressionStatus() {
      try {
        axios.defaults.withCredentials = true;
        await axios.put(`https://diplomainsight.onrender.com/status/diploma-status/update/${this.userId}`, {
          progression_status: 'Thesis Submitted'
        });

        const submittedResponse = await axios.get(`https://diplomainsight.onrender.com/status/diploma-status/current-user/${this.userId}`);
        this.submitted = submittedResponse.data;

        const themeResponse = await axios.get(`https://diplomainsight.onrender.com/status/accepted-themes/${this.userId}`);
        this.theme = themeResponse.data[0];

      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
  
<style scoped src="../css/SubmittedDispositions.css"></style>
<style scoped>
.theme-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
}

.start-deadline {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.status-button {
  background-color: #008000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.status-button:hover {
  background-color: #006400;
}

.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 50vh;
}
</style>
  