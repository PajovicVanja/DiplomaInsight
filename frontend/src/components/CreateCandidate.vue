<template>
  <form class="register-form" @submit.prevent="submitForm">
    <label for="name">Candidate Name:</label>
    <input type="text" id="name" class="input-field" v-model="candidate.name">

    <label for="studyDirection">Study Direction:</label>
    <input type="text" id="studyDirection" class="input-field" v-model="candidate.studyDirection">

    <label for="enrollmentNumber">Enrollment Number:</label>
    <input type="text" id="enrollmentNumber" class="input-field" v-model="candidate.enrollmentNumber">

    <label for="email">Email:</label>
    <input type="text" id="email" class="input-field" v-model="candidate.email">

    <label for="university">University:</label>
    <select id="university" class="input-field" v-model="candidate.university">
      <option v-for="university in universities" :key="university.id" :value="university.id">
        {{ university.name }}
      </option>
    </select>

    <label for="faculty">Faculty:</label>
    <select id="faculty" class="input-field" v-model="candidate.faculty">
      <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
        {{ faculty.name }}
      </option>
    </select>

    <label for="studyProgram">Study Program:</label>
    <select id="studyProgram" class="input-field" v-model="candidate.studyProgram">
      <option v-for="studyProgram in studyPrograms" :key="studyProgram.id" :value="studyProgram.id">
        {{ studyProgram.name }}
      </option>
    </select>

    <button type="submit" class="submit-btn">Create Candidate</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      candidate: {
        name: '',
        studyDirection: '',
        university: '',
        faculty: '',
        studyProgram: '',
        email: '', 
        enrollmentNumber: '', 
        mentorId: '',
      },
      universities: [],
      faculties: [],
      studyPrograms: [],
    };
  },
  async created() {
    try {
      const universitiesResponse = await axios.get('http://localhost:3000/university');
      this.universities = universitiesResponse.data;

      const facultiesResponse = await axios.get('http://localhost:3000/faculty');
      this.faculties = facultiesResponse.data;

      const studyProgramsResponse = await axios.get('http://localhost:3000/studyprogram');
      this.studyPrograms = studyProgramsResponse.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
  async submitForm() {
    try {

      await axios.post('http://localhost:3000/candidate/create', this.candidate);
      // Reset form fields
      this.candidate.name = '';
      this.candidate.studyDirection = '';
      this.candidate.university = '';
      this.candidate.faculty = '';
      this.candidate.studyProgram = '';
      this.candidate.email = '';
      this.candidate.enrollmentNumber = '';
      this.candidate.mentorId = '';

      alert('Candidate created successfully!');
    } catch (error) {
      console.error(error);
    }
  },
},

};
</script>
<style src="../css/candidate.css" scoped></style>
