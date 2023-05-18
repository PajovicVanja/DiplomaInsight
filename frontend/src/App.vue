<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-info">
    <a class="navbar-brand" href="#">DiplomaInsight</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="candidateDropdown" role="button" data-bs-toggle="dropdown">
            Candidates
          </a>
          <div class="dropdown-menu" aria-labelledby="candidateDropdown">
            <a class="dropdown-item" href="#" @click.prevent="showUserCreate">Create</a>
            <a class="dropdown-item" href="#" @click.prevent="showDeleteCandidate">Delete</a>
          </div>
        </li>
        <li class="nav-item" v-if="loggedIn">
          <a class="nav-link" href="#" @click.prevent="showUserProfile">Profile</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-bs-toggle="dropdown">
            Account
          </a>
          <div class="dropdown-menu" aria-labelledby="accountDropdown">
            <a class="dropdown-item" href="#" @click.prevent="showLogin">Login</a>
            <a class="dropdown-item" href="#" @click.prevent="showRegister">Register</a>
            <div class="dropdown-divider" v-if="loggedIn"></div>
            <a class="dropdown-item" href="#" v-if="loggedIn">
              <Logout @user-logged-out="loggedIn = false" />
            </a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="universityDropdown" role="button" data-bs-toggle="dropdown">
            University
          </a>
          <div class="dropdown-menu" aria-labelledby="universityDropdown">
            <a class="dropdown-item" href="#" @click.prevent="showUniversity">Add</a>
            <a class="dropdown-item" href="#" @click.prevent="showUniversityDel">Delete</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>  

  <div style="padding-top: 10%;" v-if="showLoginForm">
    <Login @hide-form="hideForms" @user-logged-in="loggedIn = true" />
  </div>

  <div style="padding-top: 10%;" v-if="showRegisterForm">
    <Register @hide-form="hideForms" />
  </div>
  <div v-if="showUniversityForm">
    <UniversityForm @hide-form="hideForms" />
  </div>
  <div v-if="showUniversityDelList">
    <DeleteUniversity @hide-form="hideForms" />
  </div>
  <div v-if="showUserCreateForm">
    <CreateCandidate @hide-form="hideForms" />
  </div>
  <div v-if="showDeleteCandidateForm">
    <DeleteCandidate @hide-form="hideForms" />
  </div>
  <div v-if="showUserProfileForm">
    <UserProfile @hide-form="hideForms" />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Logout from './components/Logout.vue';
import CreateCandidate from './components/CreateCandidate.vue';
import DeleteCandidate from './components/DeleteCandidate.vue';
import UserProfile from './components/UserProfile.vue';
import UniversityForm from './components/UniversityForm.vue';
import DeleteUniversity from './components/DeleteUniversity.vue';
import axios from 'axios';
export default {
  name: 'App',
  components: {
    Login,
    Register,
    Logout,
    CreateCandidate,
    DeleteCandidate,
    UniversityForm,
    DeleteUniversity,
    UserProfile,
  },
  created() {
    axios.get('http://localhost:3000/check-session', { withCredentials: true })
  .then(response => {
    console.log('Response:', response);
    if (response.data.loggedIn) {
      // Update the global state or a Vuex store to reflect that the user is logged in
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  },
  data() {
    return {
      showLoginForm: false,
      showRegisterForm: false,
      showUserCreateForm: false,
      loggedIn: false,
      showUniversityForm: false,
      showUniversityDelList: false,
      showUserProfileForm: false,
      showDeleteCandidateForm: false,

    };
  },
  methods: {
    showUniversity() {
      this.hideForms();
      this.showUniversityForm = true;
    },
    showUniversityDel() {
      this.hideForms();
      this.showUniversityDelList = true;
    },
    showLogin() {
      this.hideForms();
      this.showLoginForm = true;
    },
    showRegister() {
      this.hideForms();
      this.showRegisterForm = true;
    },
    showUserCreate() {
      this.hideForms();
      this.showUserCreateForm = true;
    },
    showDeleteCandidate() {
      this.hideForms();
      this.showDeleteCandidateForm = true;
    },
    showUserProfile() {
      this.hideForms();
      this.showUserProfileForm = true;
    },
    hideForms() {
      this.showLoginForm = false;
      this.showRegisterForm = false;
      this.showUserCreateForm = false;
      this.showUniversityForm = false;
      this.showUniversityDelList = false;
      this.showUserProfileForm = false;
      this.showDeleteCandidateForm = false;
    },
  },
};
</script>
