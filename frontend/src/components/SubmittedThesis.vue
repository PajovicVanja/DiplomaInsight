<template>
  <div v-if="submitted.length > 0" >
    <h1>Submitted Thesis</h1>

    <div v-for="disposition in submitted" :key="disposition.id" class="disposition-container">
      <div>
        <h3>Candidate ID: {{ disposition.candidateId }}</h3>
        <h3>Status: {{ disposition.progressStatus }}</h3>
        <h3>Next Deadline: {{ formatDeadline(disposition.deadline) }}</h3>
        <div>
    <select v-model="disposition.progressStatus">
      <option value="Thesis Reviewed">Thesis Reviewed</option>
      <option value="Thesis Defended">Thesis Defended</option>
      <option value="Diploma Issued">Diploma Issued</option>
    </select>
    <button class="statusButton" @click="updateDispositionStatus(disposition)">Update Status</button>
  </div>
  <div>
    <label>Change Deadline:</label>
    <input type="date" v-model="editedDeadlines[disposition.id]">
    <button class="deadlineButton" @click="updateDeadline(disposition)">Update Deadline</button>
  </div>
      </div>
    </div>

    
  </div>

  <div v-else class="disposition-container" style="display: flex;
        justify-content: center;
        align-items: center;">
    <h3>No themes submitted</h3>
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
      const submittedResponse = await axios.get(`http://localhost:3000/status/diploma-status/thesis-submitted/${this.mentorId}`);
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
        const response = await axios.put(`http://localhost:3000/status/updateProgress/${disposition.id}`, {
          candidateId: disposition.candidateId,
          mentorId: disposition.mentorId,
          progressStatus: disposition.progressStatus,
        });
        console.log(response.data.message);
        alert("You have succesfuly updated status!")
      } catch (error) {
        console.error(error);
      }
    },
    async updateDeadline(disposition) {
      try {
        const editedDeadline = new Date(this.editedDeadlines[disposition.id]);
        const formattedDeadline = editedDeadline.toISOString().split('T')[0];

        const response = await axios.put(`http://localhost:3000/status/updateDeadline/${disposition.id}`, {
          deadline: formattedDeadline,
        });
        console.log(response.data.message);
        alert("You have succesfuly updated deadline!")
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
