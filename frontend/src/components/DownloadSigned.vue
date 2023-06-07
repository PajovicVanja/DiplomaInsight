<template>
 <div class="parent">
  <div>
    <h1>Download signed theme</h1>
    <div v-for="theme in acceptedThemes" :key="theme.id">
      <div class="cntr">
        <button @click="downloadTheme(theme.id)">Download Theme</button>
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
      acceptedThemes: [],
    };
  },
  async created() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
      const candidateId = response.data.id;

      const themeResponse = await axios.get(`https://diplomainsight.onrender.com/status/accepted-themes/${candidateId}`);
      this.acceptedThemes = themeResponse.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    downloadTheme(themeId) {
      window.open(`https://diplomainsight.onrender.com/disposition/download-themeSigned/${themeId}`);
    },
    async updateProgressionStatus(themeId) {
      try {
        axios.defaults.withCredentials = true;
        await axios.put(`https://diplomainsight.onrender.com/status/diploma-status/update/${themeId}`, {
          progression_status: 'Thesis Submitted'
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style scoped>
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh; 
}

.parent h1 {
  font-weight: bold;
  font-size: 2em; 
  color: #333; 
}

.parent button {
  font-weight: bold;
  color: #fff; 
  background-color: #4881A0;
  border: none;
  padding: 10px 20px; 
  margin-top: 20px; 
  cursor: pointer;
  border-radius: 5px;
}

.parent button:hover {
  background-color: #366873;
}
.cntr{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>