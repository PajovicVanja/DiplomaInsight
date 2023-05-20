<template>
  <div class="form-wrapper">
    <form @submit.prevent="submitForm" class="form-section">
      <label for="name" class="form-label">University Name:</label>
      <input type="text" id="name" v-model="university.name" class="form-input">
      <label for="location" class="form-label">Location</label>
<div class="autocomplete">
  <input type="text" id="location" v-model="university.location" @input="inputChanged" @focus="inputChanged" @blur="hideSuggestions" class="form-input">
  <ul class="suggestions" v-if="showSuggestions && filteredSuggestions.length > 0">
    <li v-for="(location, index) in filteredSuggestions" :key="index" @click="selectLocation(location)">
      {{ location }}
    </li>
  </ul>
</div>
      <button type="submit" class="form-button">Add University</button>
    </form>

    <!-- //TODO AUTOCOMPLETE -->
    
    <faculty-form :key="componentKey"></faculty-form>
  </div>
</template>

  
  <script>
  import axios from 'axios';
  import FacultyForm from './FacultyForm.vue';
  
  
  export default {
    components: {
      FacultyForm,
    },
    data() {
      return {
        university: {
          name: '',
          location: '',
        },
        componentKey: 0,
        suggestions: ["Univerza v Ljubljani", "Univerza v Mariboru", "Univerza na Primorskem", "Univerza v Novem mestu","Univerza v Novi Gorici", "Nova univerza", "Samostojni visokošolski zavodi"], // Add your suggestions here
      showSuggestions: false,
      };
    },
    computed: {
    filteredSuggestions() {
      if (this.university.location.length < 3) {
        return [];
      }
      const regex = new RegExp(this.university.location, 'i');
      return this.suggestions.filter(location => location.match(regex));
    },
  },
    methods: {
      async submitForm() {
        try {
          await axios.post('http://localhost:3000/university/create', this.university);
          this.university.name = '';
          this.university.location = '';
          this.componentKey += 1; 
          alert('University added successfully!');
        } catch (error) {
          console.error(error);
        }
      },
      inputChanged() {
      this.showSuggestions = true;
    },
    hideSuggestions() {
      // Use setTimeout to delay hiding so the click event on the suggestion can be fired
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    selectLocation(location) {
      this.university.location = location;
      this.showSuggestions = false;
    }
  
    },

  };
  </script>
  <style src="../css/UniversityForm.css" scoped></style>