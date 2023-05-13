<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-info">
    <a class="navbar-brand" href="#">DiplomaInsight</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click.prevent="showLogin">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click.prevent="showRegister">Register</a>
        </li>
      </ul>
    </div>
  </nav>

  <div v-if="showLoginForm">
    <Login @hide-form="hideForms" />
  </div>

  <div v-if="showRegisterForm">
    <Register @hide-form="hideForms" />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Register from './components/Register.vue';

export default {
  name: 'App',
  components: {
    Login,
    Register
  },
  data() {
    return {
      showLoginForm: false,
      showRegisterForm: false,
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
