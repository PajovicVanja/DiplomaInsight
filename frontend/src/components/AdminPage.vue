<template>
    <div>
      <h1>All Registered Users</h1>
  
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <!-- Add more columns if needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <!-- Add more columns if needed -->
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
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
  },
};
</script>
