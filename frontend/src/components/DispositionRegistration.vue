<template>
  <div class="container">
    <h1>Register Your Disposition</h1>

    <form @submit.prevent="registerThesis" class="form-container">
      <div class="form-group">
  <button class="submit-btn" @click="downloadBlankDisposition">Download Blank Disposition Form</button>
</div>
<div class="form-group">
  <button class="submit-btn" @click="downloadBlankTheme">Download Blank Theme Form</button>
</div>
      <div class="form-group">
        <label for="disposition">Proposal Document:</label>
        <input type="file" id="disposition" class="form-input" @change="onFileChange" required>
      </div>

      <div class="form-group">
        <label for="mentor">Select available mentor:</label>
        <select id="mentor" v-model="mentorId" class="form-input" required>
          <option disabled value="">Please select a mentor</option>
          <option v-for="mentor in mentors" :key="mentor.id" :value="mentor.id">
            {{ mentor.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <button type="submit" class="submit-btn">Submit</button>
      </div>
    </form>
  </div>

  <div v-if="themeStatus">
    <ThemeSubmission />
  </div>
</template>

<script>
import axios from 'axios';
import ThemeSubmission from './ThemeSubmission.vue';
export default {
  components:{
    ThemeSubmission
  },
  data() {
    return {
      disposition: null,
      themeStatus:'',
      candidateId: '',  
      mentorId: '',  
      mentors: []  
    };
  },
  async created() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
      this.candidateId = response.data.id;

      const mentorResponse = await axios.get('https://diplomainsight.onrender.com/disposition/mentor');
      this.mentors = mentorResponse.data;

      this.fetchDispositionStatus(response.data.id);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    onFileChange(e) {
      this.disposition = e.target.files[0];
    },
    async registerThesis() {
  try {
  
    if (this.themeStatus && this.themeStatus !== 'Disposition Disapproved') {
      alert('You have already submitted a disposition.');
      return;
    }

    const formData = new FormData();
    formData.append('disposition', this.disposition);
    formData.append('candidateId', this.candidateId);
    formData.append('mentorId', this.mentorId);

    const response = await axios.post('https://diplomainsight.onrender.com/disposition/registerDisposition', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert(response.data.message);
    this.fetchDispositionStatus(this.candidateId);
  } catch (error) {
    console.error(error);
    alert('An error occurred while submitting your thesis proposal.');
  }
},
async downloadBlankDisposition() {
  try {
    const response = await axios.get('http://diplomainsight.onrender.com/document/download/disposition');
    if (response.status === 204) {
      alert('Admin did not submit any documents.');
      return;
    }
    window.location.href = "http://diplomainsight.onrender.com/document/download/disposition";
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      alert('File not found.');
    } else {
      alert('An error occurred while downloading the file.');
    }
  }
},

async downloadBlankTheme() {
    try {
        const response = await axios.get('http://diplomainsight.onrender.com/document/download/theme');
        if (response.status === 204) {
            alert('Admin did not submit any documents.');
            return;
        }
        window.location.href = "http://diplomainsight.onrender.com/document/download/theme";
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
            alert('File not found.');
        } else {
            alert('An error occurred while downloading the file.');
        }
    }
},

  fetchDispositionStatus(id) {
      if (this.candidateId !== null) {
        axios.get(`https://diplomainsight.onrender.com/disposition/statusDisp/${id}`)
          .then(response => {
            this.themeStatus = response.data.currentThemeStatus;
          })
          .catch(error => {
            console.error('Error fetching disposition status:', error);
          });
      }
    },
  }
};

</script>

<style src="../css/DispositionRegistration.css" scoped></style>
