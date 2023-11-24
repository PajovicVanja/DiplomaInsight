<template>
  <div class="progress-container">
    <div class="progress">
      <div class="progress-bar progress-bar-striped" :style="{ width: status.percentage + '%', backgroundColor: status.color }">
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
             this.loadStatus();
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        async loadStatus() {
            
            try {
                const response = await axios.get(`http://localhost:3000/status/statusForBar/${this.candidateId}`);
                this.status = response.data;
            } catch (error) {
                console.error("Error during axios call:", error);  
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
  height: 20vh; 
}

.progress {
  display: flex;
  justify-content: space-between;
  width: 80%;
  height: 50px; 
  background-color: #acacac; 
  border-radius: 25px; 
  overflow: hidden; 
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; 
  transition: width 0.4s ease-in-out; 
}

.progress-bar span {
  color: white; 
  font-weight: bold; 
}

.textClass {
  text-align: center;
  font-weight: bold;
}
</style>
