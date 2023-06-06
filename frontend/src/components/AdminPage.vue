<template>
  <div class="registered-users">
    <h1>All Registered Users</h1>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
          <td>
            <input type="password" v-model="user.newPassword" placeholder="New Password">
          </td>
          <td>
            <button @click="updateUserPassword(user)">Save</button>
          </td>
          <td>
            <button @click="fetchUserCandidates(user.id)">More</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <div class="delCand">
        <DeleteCandidate  v-if="selectedUserId !== null" :candidates="userCandidates[selectedUserId]"
          :user-id="selectedUserId" />
      </div>
      <div class="candidateChart"><canvas id="candidateChart" ></canvas></div>
    </div>
  </div>
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
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/profile');
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:3000/profile/${userId}`);
        this.users = this.users.filter(user => user.id !== userId);
        alert('User deleted successfully!');
      } catch (error) {
        console.error(error);
      }
    },
    async updateUserPassword(user) {
      try {
        const { id, newPassword } = user;
        const response = await axios.put(`http://localhost:3000/profile/${id}`, { password: newPassword });
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
        const response = await axios.get(`http://localhost:3000/candidate/user/${userId}`);
        this.userCandidates = { ...this.userCandidates, [userId]: response.data };
        this.selectedUserId = userId;
        this.generateCandidateChart();
      } catch (error) {
        console.error(error);
      }
    },
    generateCandidateChart() {
      const ctx = document.getElementById('candidateChart').getContext('2d');
      const userLabels = this.users.map(user => user.name);
      const candidateCounts = this.users.map(user => {
        const userId = user.id;
        const candidateList = this.userCandidates[userId] || [];
        return candidateList.length;
      });

      if (this.candidateChart) {
        // Destroy the previous chart if it exists
        this.candidateChart.destroy();
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
    },
  },
};
</script>

<style src="../css/admin.css" scoped></style>
