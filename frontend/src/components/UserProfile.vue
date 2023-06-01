<template>
  <div class="container">
    <div v-if="isCandidate" class="profile">
      <h2>User Profile</h2>

      <table class="profile-table">
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
        <th>Study Program:</th>
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

    <div class="profile" v-if="isAdmin || isUser">
      <h2>User Profile</h2>

      <table class="profile-table">
      <tr>
        <th>Name</th>
        <td>{{ user.name }}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ user.email }}</td>
      </tr>
      <tr>
        <th>Role</th>
        <td>{{ user.role }}</td>
      </tr>
    </table>
  </div>

  <div v-if="isCandidate || isAdmin || isUser" class="password-change">
    <h2>Change Password</h2>
    <button class="password-change-btn" @click="showChangePassword = true">Change Password</button>
    <div v-if="showChangePassword" class="password-change-form">
      <label>
        Current Password:
        <input type="password" v-model="currentPassword" class="password-change-input"/>
      </label>
      <button class="password-change-btn" @click="checkPassword()">Submit</button>
    </div>
    <div v-if="passwordMatch" class="password-change-form">
      <label>
        New Password:
        <input type="password" v-model="newPassword" class="password-change-input"/>
      </label>
      <button class="password-change-btn" @click="changePassword()">Change Password</button>
    </div>
  </div>

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
      userID: '',
      showChangePassword: false,
      currentPassword: '',
      passwordMatch: false,
      newPassword: '',
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

        if (this.isUser || this.isAdmin) {
          const userProfileResponse = await axios.get(`http://localhost:3000/profile/current`, { withCredentials: true });
          this.user = userProfileResponse.data;
        } else if (this.isCandidate) {
          const candidateProfileResponse = await axios.get(`http://localhost:3000/candidate/${this.userID}`, { withCredentials: true });
          this.user = candidateProfileResponse.data[0]; 
          console.log(this.user.study_program);

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
        return id; 
      }
    },

    async checkPassword() {
  try {
    let url;
    if (this.isAdmin || this.isUser) {
      url = `http://localhost:3000/profile/user/check-password/${this.userID}`;
    } else if (this.isCandidate) {
      url = `http://localhost:3000/profile/candidate/check-password/${this.userID}`;
    } else {
      throw new Error('Invalid user type');
    }

    const response = await axios.post(
      url,
      { password: this.currentPassword },
      { withCredentials: true }
    );

    this.passwordMatch = response.data.passwordMatch;

    if (!this.passwordMatch) {
      alert('Incorrect current password');
    }
  } catch (error) {
    console.error(error);
  }
},
async changePassword() {
  try {
    let url;
    if (this.isAdmin || this.isUser) {
      url = `http://localhost:3000/profile/user/change-password/${this.userID}`;
    } else if (this.isCandidate) {
      url = `http://localhost:3000/profile/candidate/change-password/${this.userID}`;
    } else {
      throw new Error('Invalid user type');
    }

    await axios.put(
      url,
      { password: this.newPassword },
      { withCredentials: true }
    );

    alert('Password changed successfully');
    this.newPassword = '';
    this.currentPassword = '';
    this.showChangePassword = false;
    this.passwordMatch = false;
  } catch (error) {
    console.error(error);
  }
},

  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
  padding: 0 15px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.profile {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
}

.profile h2 {
  background: #f8f9fa;
  padding: 20px;
  margin: 0;
  color: #333;
  text-align: center;
}

.profile-table {
  width: 100%;
  border-collapse: collapse;
}

.profile-table th,
.profile-table td {
  padding: 15px;
  text-align: left;
}

.profile-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* For mobile screens */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .profile {
    margin-bottom: 20px;
  }

  .profile-table th,
  .profile-table td {
    padding: 10px;
  }
}

.profile-table th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.profile-table td {
  color: #666;
  font-size: 14px;
}

.profile-table tr:hover {
  background-color: #f2f2f2;
}

.password-change {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-change h2 {
  margin-bottom: 20px;
}

.password-change-btn {
  margin-top: 20px;
  padding: 0.5em 1em;
  border: none;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.password-change-btn:hover {
  background-color: #0069d9;
}

.password-change-form {
  margin-top: 10px;
}

.password-change-input {
  display: block;
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
}

@media (max-width: 600px) {
  .container {
    width: 95%;
  }
}

</style>
