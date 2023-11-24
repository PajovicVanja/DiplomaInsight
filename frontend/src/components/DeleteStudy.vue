<template>
  <div class="main">
    <h4>Study Programs</h4>
    <ul>
      <li v-for="program in programs" :key="program.id">
        <div class="program-item">
          <span class="program-name">{{ program.name }}, faculty - {{ getFacultyName(program.faculty_id) }}</span>
          <div class="button-container">
            <button @click="deleteProgram(program.id)" class="del-btn">Delete</button>
            <button @click="startEditing(program)" class="edit-btn">Edit</button>
          </div>
        </div>
        
        <div v-if="editingProgramId === program.id">
          <form @submit.prevent="submitForm">
            <label for="name">Study Program Name:</label>
            <input type="text" id="name" v-model="editingProgram.name">
  
            <label for="faculty_id">Faculty:</label>
            <select v-model="editingProgram.faculty_id">
              <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
                {{ faculty.name }}
              </option>
            </select>
  
            <button type="submit" class="update-btn">Update Study Program</button>
          </form>
        </div>
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
      editingProgramId: null,
      editingProgram: {
        name: '',
        faculty_id: ''
      }
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
    startEditing(program) {
      this.editingProgramId = program.id;
      this.editingProgram = { ...program };
    },
    async submitForm() {
      try {
        await axios.put(`http://localhost:3000/studyProgram/${this.editingProgramId}`, this.editingProgram);
        const index = this.programs.findIndex(program => program.id === this.editingProgramId);
        this.programs[index] = this.editingProgram;
        this.editingProgramId = null;
        this.editingProgram = { name: '', faculty_id: '' };
      } catch (error) {
        console.error(error);
      }
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
<style src="../css/DeletingList.css" scoped></style>