<template>
    <div>
      <h2>Create Candidate List</h2>
      <form @submit.prevent="createList">
        <div v-for="(candidate, index) in candidates" :key="index">
          <h3>Candidate {{ index + 1 }}</h3>
          <label>First Name:</label>
          <input type="text" v-model="candidate.firstName" required><br><br>
          <label>Last Name:</label>
          <input type="text" v-model="candidate.lastName" required><br><br>
          <label>Study Program:</label>
          <input type="text" v-model="candidate.studyProgram" required><br><br>
          <label>University:</label>
          <input type="text" v-model="candidate.university" required><br><br>
          <label>Faculty:</label>
          <input type="text" v-model="candidate.faculty" required><br><br>
          <label>Student ID:</label>
          <input type="text" v-model="candidate.studentId" required><br><br>
          <label>Email:</label>
          <input type="email" v-model="candidate.email" required><br><br>
          <hr>
        </div>
        <button type="submit">Create List</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        candidates: [{ firstName: '', lastName: '', studyProgram: '', university: '', faculty: '', studentId: '', email: '' }]
      }
    },
    methods: {
      async createList() {
        try {
          const response = await fetch('/api/candidate-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.candidates)
          });
          if (response.ok) {
            alert('Candidate list created successfully!');
            this.candidates = [{ firstName: '', lastName: '', studyProgram: '', university: '', faculty: '', studentId: '', email: '' }];
          } else {
            alert('Error creating candidate list');
          }
        } catch (error) {
          console.error(error);
          alert('Error creating candidate list');
        }
      }
    }
  }
  </script>
  