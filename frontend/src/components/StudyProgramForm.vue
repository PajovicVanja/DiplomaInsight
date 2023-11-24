<template>
  <form @submit.prevent="submitForm" class="form-section">
    <label for="name" class="form-label">Study Program Name:</label>
    <input type="text" id="name" v-model="studyProgram.name" class="form-input">
    
    <label for="faculty_id" class="form-label">Faculty:</label>
    <select v-model="studyProgram.faculty_id" class="form-input">
      <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
        {{ faculty.name }}
      </option>
    </select>

    <button type="submit" class="form-button">Add Study Program</button>
  </form>
</template>

  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        studyProgram: {
          name: '',
          faculty_id: '',
        },
        faculties: [],
      };
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:3000/faculty');
        this.faculties = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
      async submitForm() {
        try {
          await axios.post('http://localhost:3000/studyprogram/create', this.studyProgram);
          this.studyProgram.name = '';
          this.studyProgram.faculty_id = '';
          alert('Study program added successfully!');
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  <style src="../css/UniversityForm.css" scoped></style>