<template>
    <div class="mentor-home">
      <h1 class="mentor-title">Mentor's Dashboard</h1>
  
      <div class="mentor-stats">
        <div class="statistic disposition-stat">
          <h2>Approved/Updated Dispositions</h2>
          <p>{{ dispositionsCount }}</p>
        </div>
  
        <div class="statistic theme-stat">
          <h2>Submitted Themes</h2>
          <p>{{ themesCount }}</p>
        </div>
  
        <div class="statistic candidates-stat">
          <h2>Total Candidates</h2>
          <p>{{ candidatesCount }}</p>
          <ul class="candidate-list">
            <li v-for="candidate in candidates" :key="candidate.id" class="candidate-item">
              {{ candidate.name }}
            </li>
          </ul>
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
        dispositionsCount: 0,
        themesCount: 0,
        candidatesCount: 0,
        candidates: [],
      };
    },
    async created() {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
        this.mentorId = response.data.id;
  
        // Fetch the dispositions count
        const dispositionsResponse = await axios.get(`https://diplomainsight.onrender.com/status/mentor/dispositionsCount/${this.mentorId}`);
        this.dispositionsCount = dispositionsResponse.data.dispositionsCount;
  
        // Fetch the themes count
        const themesResponse = await axios.get(`https://diplomainsight.onrender.com/status/mentor/themesCount/${this.mentorId}`);
        this.themesCount = themesResponse.data.themesCount;
  
        // Fetch the candidates count and their names
        const candidatesResponse = await axios.get(`https://diplomainsight.onrender.com/status/mentor/candidates/${this.mentorId}`);
        this.candidatesCount = candidatesResponse.data.candidatesCount;
        this.candidates = candidatesResponse.data.candidates;
  
      } catch (error) {
        console.error(error);
      }
    },
  };
  </script>
  
  <style scoped>
  .mentor-home {
    background-color: #f0f0f0;
    color: #333;
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  .mentor-title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .mentor-stats {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .statistic {
    background-color: #fafafa;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    width: 90%;
    box-sizing: border-box;
    text-align: center;
  }
  
  .statistic h2 {
    font-size: 1.4em;
    margin-bottom: 10px;
    color: #1c8cdc;
  }
  
  .statistic p {
    font-size: 1.6em;
    color: #555;
  }
  
  .disposition-stat {
    border-left: 10px solid #f1c40f;
  }
  
  .theme-stat {
    border-left: 10px solid #e67e22;
  }
  
  .candidates-stat {
    border-left: 10px solid #16a085;
  }
  
  .candidate-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .candidate-item {
    padding: 5px;
    margin: 5px 0;
    background-color: #e6e6e6;
    border-radius: 5px;
  }
  </style>
  
  
  

  