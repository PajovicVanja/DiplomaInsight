<template>
        <a @click="logout" >>>Logout</a> 
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'LogoutUser',
  methods: {
    logout() {
      axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
        .then(response => {
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
