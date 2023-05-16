
<template>
    <div>
        <h4>Delete a Study Program</h4>
      <ul>
        <li v-for="program in programs" :key="program.id">
          {{ program.name }}, faculty - {{ getFacultyName(program.faculty_id) }}
          <button @click="deleteProgram(program.id)">Delete</button>
        </li>
      </ul>
    </div>
</template>
  
<script>
import axios from 'axios';
  
export default {
  data() {
    return {
      programs: [],
      faculties: [],
    };
  },
  async created() {
    try {
      const [programsResponse, facultiesResponse] = await Promise.all([
        axios.get('http://localhost:3000/studyProgram'),
        axios.get('http://localhost:3000/faculty')
      ]);

      this.programs = programsResponse.data;
      this.faculties = facultiesResponse.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    getFacultyName(id) {
      const faculty = this.faculties.find(faculty => faculty.id === id);
      return faculty ? faculty.name : '';
    },
    async deleteProgram(id) {
      try {
        await axios.delete(`http://localhost:3000/studyProgram/${id}`);
        this.programs = this.programs.filter((program) => program.id !== id);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
