<template>
    <div class="divclass">
        <h1 class="h1class">Mentors Comment</h1>
        <p class="p"> {{ comment }}</p>
    </div>
    <div class="container">
        <h1>Update Your Disposition</h1>

        <form @submit.prevent="registerThesis" class="form-container">
      <div class="form-group">
        <label for="disposition">Proposal Document:</label>
        <input type="file" id="disposition" class="form-input" @change="onFileChange" required>
      </div>

      <div class="form-group">
        <label for="mentor">Select Mentor:</label>
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
    <div>
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
            dispositionId: null,  
            candidateId: '',
            comment: '',
            mentorId: '', 
            mentors: [],  
        };
    },
    async created() {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
            this.candidateId = response.data.id;

            const commentResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/comment/${this.candidateId}`);
            this.comment = commentResponse.data.comment;

            const mentorResponse = await axios.get('https://diplomainsight.onrender.com/disposition/mentor');
            this.mentors = mentorResponse.data;

            const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/${this.candidateId}`);
            this.dispositionId = dispositionResponse.data.id; // Get the disposition ID
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        onFileChange(e) {
            this.disposition = e.target.files[0];
        },
        async registerThesis() {
            const formData = new FormData();
            formData.append('disposition', this.disposition);
            formData.append('candidateId', this.candidateId);
            formData.append('mentorId', this.mentorId);

            try {
                const response = await axios.put(`https://diplomainsight.onrender.com/disposition/updateDisposition/${this.dispositionId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                alert(response.data.message);
            } catch (error) {
                console.error(error);
                alert('An error occurred while submitting your thesis proposal.');
            }
        }
    }
};
</script>
<style src="../css/DispositionRegistration.css" scoped></style>
<style scoped>
.divclass {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1em;
}

.h1class {
  font-size: 2em;
  color: #444;
}

.p {
  font-size: 1.5em;
  color: #666;
}

.container {
  margin-top: 2em;
}

@media (max-width: 768px) {
  .h1class {
    font-size: 1.5em;
  }

  .p {
    font-size: 1.2em;
  }
}

</style>
