<template>
  <div class="wrapper">
    <nav>
      <input type="checkbox" id="show-menu">
      <label for="show-menu" class="menu-icon"><i class="fas fa-bars"></i></label>
      <div class="content">
        <div class="logo"><a href="#">DiplomaInsight</a></div>
        <ul class="links">
          <li v-if="loggedIn">
            <a href="#" class="desktop-link">Candidates</a>
            <input type="checkbox" id="show-candidates">
            <label for="show-candidates">Candidates</label>
            <ul>
              <li><a href="#" @click.prevent="showUserCreate">Create</a></li>
              <li><a href="#" @click.prevent="showDeleteCandidate">Delete</a></li>
            </ul>
          </li>
          <li v-if="loggedIn"><a href="#" @click.prevent="showUserProfile">Profile</a></li>
          <li>
            <a href="#" class="desktop-link">Account</a>
            <input type="checkbox" id="show-account">
            <label for="show-account">Account</label>
            <ul>
              <li><a href="#" @click.prevent="showLogin">Login</a></li>
              <li><a href="#" @click.prevent="showRegister">Register</a></li>
              <li v-if="loggedIn">
                <a href="#">
                  <Logout @user-logged-out="loggedIn = false" />
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#" class="desktop-link">University</a>
            <input type="checkbox" id="show-university">
            <label for="show-university">University</label>
            <ul>
              <li><a href="#" @click.prevent="showUniversity">Create</a></li>
              <li><a href="#" @click.prevent="showUniversityDel">Delete</a></li>
            </ul>
          </li>
          <li>
            <a href="#" class="desktop-link">Diploma</a>
            <input type="checkbox" id="show-diploma">
            <label for="show-diploma">Diploma</label>
            <ul>
              <li><a href="#" @click.prevent="showDiplomaCreate">Create</a></li>
              <li><a href="#" @click.prevent="showDeleteDiploma">Delete</a></li>
            </ul>
          </li>
          <li>
            <a href="#" class="desktop-link">Help</a>
            <input type="checkbox" id="show-help">
            <label for="show-help">Help</label>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </li>
        </ul>
      </div>
   
    </nav>
  </div>

  <div style="padding-top: 10%;" v-if="showLoginForm">
    <Login @hide-form="hideForms" @user-logged-in="loggedIn = true" />
  </div>

  <div style="padding-top: 10%;" v-if="showRegisterForm">
    <Register @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showUniversityForm">
    <UniversityForm @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showUniversityDelList">
    <DeleteUniversity @hide-form="hideForms" />
  </div>





  <div style="padding-top: 10%;" v-if="showUserCreateForm">
    <CreateCandidate @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showDeleteCandidateForm">
    <DeleteCandidate @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showUserProfileForm">
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
<style src="./css/App.css" scoped></style>