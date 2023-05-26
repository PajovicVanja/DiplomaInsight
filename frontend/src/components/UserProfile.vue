<template>
  <div>
    <h2>User Profile</h2>

    <table>
      <tr>
        <th>Name</th>
        <td>{{ user.name }}</td>
      </tr>
      <tr>
        <th>Study Direction</th>
        <td>{{ user.study_direction }}</td>
      </tr>
      <tr>
        <th>University</th>
        <td>{{ user.university }}</td>
      </tr>
      <tr>
        <th>Faculty</th>
        <td>{{ user.faculty }}</td>
      </tr>
      <tr>
        <td>Study Program:</td>
        <td>{{ user.study_program }}</td>
      </tr>
      <tr>
        <th>Enrollment Number</th>
        <td>{{ user.enrollment_number }}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ user.email }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        name: '',
        study_direction: '',
        university: '',
        faculty: '',
        enrollment_number: '',
        email: '',
        study_program: '',
      },
      isAdmin: false,
      isUser: false,
      isCandidate: false,
      userID: ''
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/check-session', { withCredentials: true });
      if (response.data.loggedIn) {
        this.isAdmin = response.data.user.role === 'admin';
        this.isUser = response.data.user.role === 'user';
        this.isCandidate = response.data.user.role === 'candidate';
        this.userID = response.data.user.id;

        if (this.isUser) {
          const userProfileResponse = await axios.get(`http://localhost:3000/profile/${this.userID}`, { withCredentials: true });
          this.user = userProfileResponse.data;
        } else if (this.isCandidate) {
          const candidateProfileResponse = await axios.get(`http://localhost:3000/candidate/${this.userID}`, { withCredentials: true });
          this.user = candidateProfileResponse.data[0]; // assuming that the response is an array and you need the first object
          console.log(this.user.study_program);

          // Fetch faculty and university names
          this.user.faculty = await this.getNameFromID('faculty', this.user.faculty);
          this.user.university = await this.getNameFromID('university', this.user.university);
          this.user.study_program = await this.getNameFromID('studyProgram', this.user.study_program);

        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async updateProfile() {
      try {
        if (this.isUser) {
          await axios.put(`http://localhost:3000/profile/${this.userID}`, this.user, { withCredentials: true });
          alert('Profile updated successfully');
        } else if (this.isCandidate) {
          await axios.put(`http://localhost:3000/candidate/${this.userID}`, this.user, { withCredentials: true });
          alert('Profile updated successfully');
        } else {
          // Handle admin update here if necessary
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getNameFromID(type, id) {
      try {
        const response = await axios.get(`http://localhost:3000/${type}/${type}/${id}`, { withCredentials: true });
        return response.data;
      } catch (error) {
        console.error(error);
        return id; // If fetching the name fails, return the ID
      }
    }
  }
};
</script>
