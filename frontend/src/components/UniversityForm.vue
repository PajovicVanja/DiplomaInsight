<template>
  <div class="form-wrapper">
    <form @submit.prevent="submitForm" class="form-section">
      <label for="name" class="form-label">University Name:</label>
      <div class="autocomplete">
        <input type="text" id="names" v-model="university.name" @input="inputChangedName" @focus="inputChangedName"
          @blur="hideSuggestionsName" class="form-input">
        <ul class="suggestions" v-if="showSuggestionsNames && filteredSuggestionsNames.length > 0">
          <li v-for="(name, index) in filteredSuggestionsNames" :key="index" @click="selectName(name)">
            {{ name }}
          </li>
        </ul>
      </div>
      <label for="location" class="form-label">Location</label>
      <div class="autocomplete">
        <input type="text" id="location" v-model="university.location" @input="inputChangedLocation" @focus="inputChangedLocation"
          @blur="hideSuggestionsLocation" class="form-input">
        <ul class="suggestions" v-if="showSuggestionsLocation && filteredSuggestionsLocation.length > 0">
          <li v-for="(location, index) in filteredSuggestionsLocation" :key="index" @click="selectLocation(location)">
            {{ location }}
          </li>
        </ul>
      </div>
      <button type="submit" class="form-button">Add University</button>
    </form>


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
      suggestionsNames: [
        "Univerza v Ljubljani",
        "Univerza v Mariboru",
        "Univerza na Primorskem",
        "Univerza v Novem mestu",
        "Univerza v Novi Gorici",
        "Nova univerza",
        "Samostojni visokošolski zavodi",
      ],
      suggestionsLocations: [
        "Maribor, Slovenia",
        "Ljubljana, Slovenia",
        "Celje, Slovenia",
      ],
      showSuggestionsLocation: false,
      showSuggestionsNames: false,
    };
  },
  computed: {
    filteredSuggestionsLocation() {
      if (this.university.location.length < 3) {
        return [];
      }
      const regex = new RegExp(this.university.location, 'i');
      return this.suggestionsLocations.filter(location => location.match(regex));
    },
    filteredSuggestionsNames() {
      if (this.university.name.length < 3) {
        return [];
      }
      const regex = new RegExp(this.university.name, 'i');
      return this.suggestionsNames.filter(name => name.match(regex));
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
    inputChangedLocation() {
      this.showSuggestionsLocation = true;
    },
    hideSuggestionsLocation() {
      setTimeout(() => {
        this.showSuggestionsLocation = false;
      }, 200);
    },
    selectLocation(location) {
      this.university.location = location;
      this.showSuggestionsLocation = false;
    },
    inputChangedName() {
      this.showSuggestionsNames = true;
    },
    hideSuggestionsName() {
      setTimeout(() => {
        this.showSuggestionsNames = false;
      }, 200);
    },
    selectName(name) {
      this.university.name = name;
      this.showSuggestionsNames = false;
    },
  },
};
</script>
<style src="../css/UniversityForm.css" scoped></style>