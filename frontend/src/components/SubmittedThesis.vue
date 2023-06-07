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
    <label>Add date for defending</label>
    <input type="date" v-model="editedDefending[disposition.id]">
    <button class="deadlineButton" @click="updateDefending(disposition)">Set</button>
  </div>
  <div>
    <label>Change Deadline:</label>
    <input type="date" v-model="editedDeadlines[disposition.id]">
    <button class="deadlineButton" @click="updateDeadline(disposition)">Update Deadline</button>
  </div>
  
      </div>
    </div>

    
  </div>

  <div v-else class="disposition-container" style="display: flex,
        justify-content: center,
        align-items: center">
    <h3>No themes submitted</h3>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mentorId: '',
      submitted: [], 
      selectedFile: null, 
      editedDeadlines: {},
      editedDefending: {},
    };
  },
  async created() {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:3000/profile/current');
      this.mentorId = response.data.id;

      const submittedResponse = await axios.get(`http://localhost:3000/status/diploma-status/thesis-submitted/${this.mentorId}`);
      this.submitted = submittedResponse.data;

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
            //eslint-disable-next-line no-unused-vars
        const response = await axios.put(`http://localhost:3000/status/updateProgress/${disposition.id}`, {
          candidateId: disposition.candidateId,
          mentorId: disposition.mentorId,
          progressStatus: disposition.progressStatus,
        });
        alert("You have succesfuly updated status!")
      } catch (error) {
        console.error(error);
      }
    },
    async updateDeadline(disposition) {
      try {
        const editedDeadline = new Date(this.editedDeadlines[disposition.id]);
        const formattedDeadline = editedDeadline.toISOString().split('T')[0];
        //eslint-disable-next-line no-unused-vars
        const response = await axios.put(`http://localhost:3000/status/updateDeadline/${disposition.id}`, {
          deadline: formattedDeadline,
          candidateId: disposition.candidateId,
        });
        alert("You have succesfuly updated deadline!")
      } catch (error) {
        console.error(error);
      }
    },
    async updateDefending(disposition) {
      try {
        const editedDefending = new Date(this.editedDefending[disposition.id]);
        const defending = editedDefending.toISOString().split('T')[0];
        // eslint-disable-next-line no-unused-vars
        const response = await axios.put(`http://localhost:3000/status/updateDefending/${disposition.id}`, {
          deadline: defending,
          candidateId: disposition.candidateId,
        });
        alert("You have succesfuly set defending date!")
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
      return 'N/A'; 
    },
  },
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>
