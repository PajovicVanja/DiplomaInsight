<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          'https://diplomainsight.onrender.com/login',
          {
            email: this.email,
            password: this.password
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          this.$emit('user-logged-in');   // ✅ Notify App.vue
        }

      } catch (error) {
        if (error.response) {
          alert(error.response.data);
        } else {
          console.error('Error:', error);
        }
      }
    }
  }
}
</script>
