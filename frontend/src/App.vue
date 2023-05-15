<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-info">
    <a class="navbar-brand" href="#">DiplomaInsight</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
            Account
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#" @click.prevent="showLogin">Login</a>
            <a class="dropdown-item" href="#" @click.prevent="showRegister">Register</a>
            <div class="dropdown-divider" v-if="loggedIn"></div>
            <a class="dropdown-item" href="#" v-if="loggedIn">
              <Logout @user-logged-out="loggedIn = false" />
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>

  <div v-if="showLoginForm">
    <Login @hide-form="hideForms" @user-logged-in="loggedIn = true" />
  </div>

  <div v-if="showRegisterForm">
    <Register @hide-form="hideForms" />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Logout from './components/Logout.vue';
import axios from 'axios';
export default {
  name: 'App',
  components: {
    Login,
    Register,
    Logout
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
      loggedIn: false,
    };
  },
  methods: {
    showLogin() {
      this.hideForms();
      this.showLoginForm = true;
    },
    showRegister() {
      this.hideForms();
      this.showRegisterForm = true;
    },
    hideForms() {
      this.showLoginForm = false;
      this.showRegisterForm = false;
    },
  },
};
</script>
