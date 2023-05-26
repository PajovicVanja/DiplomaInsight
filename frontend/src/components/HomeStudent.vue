<template>
  <div class="progress-container">
    <div class="progress">
      <div class="progress-bar progress-bar-striped" :style="{ width: status.percentage + '%', backgroundColor: status.color }">
        <!-- <span>{{ status.text }}</span> -->
      </div>
    </div>
  </div>
  <h2 class="textClass">{{ status.text }}</h2>
<div v-if="status.text == 'Congratulations! Now start working on your diploma, watch out for deadlines!'">
  <DiplomaStatus  />
</div>

  
</template>
  
<script>
import axios from 'axios';
import DiplomaStatus from './DiplomaStatus.vue';
export default {
  components: {
    DiplomaStatus
  },  
    data() {
      return {
        status: {
          text: 'Submit your Disposition and Theme Form',
          color: 'red',
          percentage: 5,
        },
        candidateId: null,
      };
    },
    async created() {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/profile/current');
            this.candidateId = response.data.id;
            console.log('Candidate ID:', this.candidateId);  
             this.loadStatus();
             console.log(this.status.color);
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        async loadStatus() {
            console.log('loadStatus called');  // Debug log
            // Call to backend to get status
            try {
                const response = await axios.get(`http://localhost:3000/status/statusForBar/${this.candidateId}`);
                console.log('axios response:', response.data);  // Debug log
                this.status = response.data;
            } catch (error) {
                console.error("Error during axios call:", error);  // log the error for debugging
            }
        }
    },
}
</script>


<style>
.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh; /* take the full height of the viewport */
}

.progress {
  display: flex;
  justify-content: space-between;
  width: 80%;
  height: 50px; /* This will make the progress bar thicker */
  background-color: #acacac; /* A background color that will be visible when the progress bar isn't full */
  border-radius: 25px; /* Round the corners of the progress bar */
  overflow: hidden; /* Make sure the inner div stays inside the rounded corners */
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* Make sure the inner div takes the full height of the outer div */
  transition: width 0.4s ease-in-out; /* Smooth transition for the width */
}

.progress-bar span {
  color: white; /* Make the text white so it contrasts with the progress bar color */
  font-weight: bold; /* Make the text bold for more emphasis */
}

.textClass {
  text-align: center;
  font-weight: bold;
}
</style>
