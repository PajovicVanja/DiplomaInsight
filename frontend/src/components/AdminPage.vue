<template>
  <div class="registered-users">
    <h1>All Registered Users</h1>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="deleteUser(user.id)" class="del-btn">Delete</button>
            </td>
            <td>
              <input type="password" v-model="user.newPassword" placeholder="New Password">
            </td>
            <td>
              <button @click="updateUserPassword(user)" class="save-btn">Save</button>
            </td>
            <td>
              <button @click="fetchUserCandidates(user.id)" class="more-btn">More</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="reports">

      <div class="candidateChart">
        <canvas id="candidateChart"></canvas>
      </div>
      <div class="userCandidateChart">
        <canvas id="userCandidateChart"></canvas>
      </div>
      <!-- Modal -->
      <div v-if="selectedUserId !== null" class="modal" id="userModal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <DeleteCandidate :candidates="userCandidates[selectedUserId]" :user-id="selectedUserId" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="isModalOpen" class="modal-overlay blurred-elements"></div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import DeleteCandidate from './DeleteCandidate.vue'

export default {
  components: {
    DeleteCandidate,
  },
  data() {
    return {
      users: [],
      userCandidates: {},
      selectedUserId: null,
      candidateChart: null, // Track the chart instance
      userCandidateChart: null, // Track the user candidate chart instance
      isGeneratingChart: false,


    };
  },
  created() {
    this.fetchUsers();
  },
  beforeUnmount() {
    if (this.candidateChart && this.candidateChart.destroy) {
      this.candidateChart.destroy();
    }
    if (this.userCandidateChart && this.userCandidateChart.destroy) {
      this.userCandidateChart.destroy();
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('https://diplomainsight.onrender.com/profile');
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`https://diplomainsight.onrender.com/profile/${userId}`);
        this.users = this.users.filter(user => user.id !== userId);
        alert('User deleted successfully!');
      } catch (error) {
        console.error(error);
      }
    },
    async updateUserPassword(user) {
      try {
        const { id, newPassword } = user;
        const response = await axios.put(`https://diplomainsight.onrender.com/profile/${id}`, { password: newPassword });
        if (response.status === 200) {
          alert('Password updated successfully!');
        } else {
          alert('Failed to update password. Please try again.');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUserCandidates(userId) {
      try {
        const response = await axios.get(`https://diplomainsight.onrender.com/candidate/user/${userId}`);
        this.userCandidates = { ...this.userCandidates, [userId]: response.data };
        this.selectedUserId = userId;
        this.generateCandidateChart();
        this.generateUserCandidateChart(userId); // New method call
      } catch (error) {
        console.error(error);
      }
    },
    getProgressLabel(progress) {
      const progressLabels = [
        'Process Started',
        'Thesis Submitted',
        'Thesis Reviewed',
        'Thesis Defended',
        'Diploma Issued'
      ];

      return progressLabels[progress];
    },
    generateCandidateChart() {
      if (this.isGeneratingChart) {
        return; // Chart generation is already in progress, so return
      }

      this.isGeneratingChart = true; // Set flag to indicate chart generation is in progress

      const ctx = document.getElementById('candidateChart').getContext('2d');
      const userLabels = this.users.map(user => user.name);
      const candidateCounts = this.users.map(user => {
        const userId = user.id;
        const candidateList = this.userCandidates[userId] || [];
        return candidateList.length;
      });

      if (this.candidateChart) {
        this.candidateChart.destroy(); // Destroy the previous chart if it exists
      }

      this.candidateChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: userLabels,
          datasets: [
            {
              label: 'Candidate Count',
              data: candidateCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
            },
          },
        },
      });

      this.isGeneratingChart = false; // Reset the flag
    },


    generateUserCandidateChart(userId) {
      if (this.isGeneratingChart) {
        return; // Chart generation is already in progress, so return
      }

      this.isGeneratingChart = true; // Set flag to indicate chart generation is in progress

      const ctx = document.getElementById('userCandidateChart').getContext('2d');
      const candidateList = this.userCandidates[userId] || [];

      const candidateNames = candidateList.map(candidate => candidate.name);
      const candidateProgress = candidateList.map(candidate => candidate.progress);

      const progressLabels = [
        'Process Started',
        'Thesis Submitted',
        'Thesis Reviewed',
        'Thesis Defended',
        'Diploma Issued'
      ];

      if (this.userCandidateChart) {
        this.userCandidateChart.destroy();
      }

      this.userCandidateChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: candidateNames,
          datasets: [
            {
              label: 'Progress Status',
              data: candidateProgress,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'User Candidate Progress',
            },
          },
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
              ticks: {
                precision: 0,
              },
              reverse: true,
              scaleLabel: {
                display: true,
                labelString: 'Progress',
              },
              type: 'category',
              labels: progressLabels,
            },
          },
        },
      });

      this.userCandidateChart.options.onClick = (event, elements) => {
        if (elements.length > 0) {
          const clickedDatasetIndex = elements[0].datasetIndex;
          const clickedIndex = elements[0].index;
          const candidateList = this.userCandidates[userId] || [];

          // Check if the click is on a valid bar
          if (clickedDatasetIndex === 0 && clickedIndex < candidateList.length) {
            this.selectedUserId = userId;
            this.openModal();
          }
        }
      }; this.isGeneratingChart = false; // Reset the flag
    },

    openModal() {
      const modal = document.getElementById('userModal');
      if (modal) {
        modal.style.display = 'block';
      }
    },

    closeModal() {
      const modal = document.getElementById('userModal');
      if (modal) {
        modal.style.display = 'none';
      }
      this.selectedUserId = null;
    },


  },
};
</script>
<style scoped>
/* Modal styles */
.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #333;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 40%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  /* Add backdrop-filter property with blur value */
  z-index: 9998;
}

.blurred-elements {
  backdrop-filter: blur(5px);
}
</style>
<style src="../css/admin.css" scoped></style>