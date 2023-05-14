<template>
    <div>
        <a class="nav-link"><button class="btn" @click="logout">Logout</button></a> 
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'LogoutUser',
  methods: {
    logout() {
      axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
        .then(response => {
          console.log('Logout response:', response);
          if (response.status === 200) {
            this.$emit('user-logged-out');
          }
        })
        .catch(error => {
          console.error('Logout error:', error);
        });
    },
  },
};
</script>
