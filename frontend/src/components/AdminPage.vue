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

    <DeleteCandidate v-if="selectedUserId !== null" :candidates="userCandidates[selectedUserId]" :user-id="selectedUserId" />
 
  </div>
</template>

<script>
import axios from 'axios';
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
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style src="../css/admin.css" scoped></style>
