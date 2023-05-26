<template>
  <div>
    <h1>Submitted Thesis</h1>

    <div v-for="disposition in submitted" :key="disposition.id" class="disposition-container">
      <div>
        <h3>Candidate ID: {{ disposition.candidateId }}</h3>
        <h3>Status: {{ disposition.progressStatus }}</h3>
        <h3>Next Deadline: {{ formatDeadline(disposition.deadline) }}</h3>
        <div>
          <select v-model="disposition.progressStatus" @change="updateDispositionStatus(disposition)">
            <option value="Thesis Reviewed">Thesis Reviewed</option>
            <option value="Thesis Defended">Thesis Defended</option>
            <option value="Diploma Issued">Diploma Issued</option>
          </select>
          <label>Change Deadline:</label>
          <input type="date" v-model="editedDeadlines[disposition.id]" @change="updateDeadline(disposition)">
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
      mentorId: '',
      submitted: [], // Holds the list of submitted dispositions
      selectedFile: null, // Holds the selected file
      editedDeadlines: {}, // Holds the edited deadlines for each disposition
    };
  },
  async created() {
    try {
      // Fetch the current user's ID
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:3000/profile/current');
      this.mentorId = response.data.id;

      // Fetch submitted dispositions with theme status "Theme Submitted" for the mentorId
      const submittedResponse = await axios.get(`http://localhost:3000/disposition/diploma-status/thesis-submitted/${this.mentorId}`);
      this.submitted = submittedResponse.data;

      // Initialize the edited deadlines with the current deadlines
      this.submitted.forEach((disposition) => {
        this.editedDeadlines[disposition.id] = disposition.deadline;
      });
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async updateDispositionStatus(disposition) {
      try {
        const response = await axios.put(`http://localhost:3000/disposition/updateProgress/${disposition.id}`, {
          candidateId: disposition.candidateId,
          mentorId: disposition.mentorId,
          progressStatus: disposition.progressStatus,
        });
        console.log(response.data.message);
      } catch (error) {
        console.error(error);
      }
    },
    async updateDeadline(disposition) {
  try {
    const editedDeadline = new Date(this.editedDeadlines[disposition.id]);
    const formattedDeadline = editedDeadline.toISOString().split('T')[0];

    const response = await axios.put(`http://localhost:3000/disposition/updateDeadline/${disposition.id}`, {
      deadline: formattedDeadline,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error(error);
  }
},


    formatDeadline(deadline) {
    if (deadline) {
      const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return formattedDeadline;
    }
    return 'N/A'; // If no deadline is set, display "N/A"
  },
  },
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>
