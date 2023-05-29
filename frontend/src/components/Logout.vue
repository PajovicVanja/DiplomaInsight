<template>
        <a @click="logout" >>>Logout</a> 
</template>
  
<script>
import axios from 'axios';

export default {
  name: 'LogoutUser',
  methods: {
    logout() {
      axios.post('https://diplomainsight.onrender.com/logout', {}, { withCredentials: true })
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
