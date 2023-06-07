<template>
  <div class="main">
    <h4>Delete a Faculty</h4>
    <ul>
      <li v-for="faculty in faculties" :key="faculty.id">
        <div class="faculty-item">
          <span class="faculty-name">{{ faculty.name }}, university - {{ getUniversityName(faculty.university_id) }}</span>
          <div class="button-container">
            <button @click="deleteFaculty(faculty.id)" class="del-btn">Delete</button>
            <button @click="startEditing(faculty)" class="edit-btn">Edit</button>
          </div>
        </div>
        
        <div v-if="editingFacultyId === faculty.id">
          <form @submit.prevent="submitForm">
            <label for="name">Faculty Name:</label>
            <input type="text" id="name" v-model="editingFaculty.name">
  
            <label for="university_id">University:</label>
            <select v-model="editingFaculty.university_id">
              <option v-for="university in universities" :key="university.id" :value="university.id">
                {{ university.name }}
              </option>
            </select>
  
            <button type="submit" class="update-btn">Update Faculty</button>
          </form>
        </div>
      </li>
    </ul>
  </div>
  <div>
    <DeleteStudy :key="componentKey"></DeleteStudy>
  </div>
  
</template>

<script>
import axios from 'axios';
import DeleteStudy from './DeleteStudy.vue';

export default {
  components: {
    DeleteStudy
  },
  data() {
    return {
      faculties: [],
      universities: [],
      componentKey: 0,
      editingFacultyId: null,
      editingFaculty: {
        name: '',
        university_id: ''
      }
    };
  },
  async created() {
    try {
      const [facultiesResponse, universitiesResponse] = await Promise.all([
        axios.get('https://diplomainsight.onrender.com/faculty'),
        axios.get('https://diplomainsight.onrender.com/university')
      ]);

      this.faculties = facultiesResponse.data;
      this.universities = universitiesResponse.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    getUniversityName(id) {
      const university = this.universities.find(university => university.id === id);
      return university ? university.name : '';
    },
    startEditing(faculty) {
      this.editingFacultyId = faculty.id;
      this.editingFaculty = { ...faculty };
    },
    async submitForm() {
      try {
        await axios.put(`https://diplomainsight.onrender.com/faculty/${this.editingFacultyId}`, this.editingFaculty);
        const index = this.faculties.findIndex(faculty => faculty.id === this.editingFacultyId);
        this.faculties[index] = this.editingFaculty;
        this.editingFacultyId = null;
        this.editingFaculty = { name: '', university_id: '' };
        this.componentKey += 1;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteFaculty(id) {
      try {
        await axios.delete(`https://diplomainsight.onrender.com/faculty/${id}`);
        this.faculties = this.faculties.filter((faculty) => faculty.id !== id);
        this.componentKey += 1;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style src="../css/DeletingList.css" scoped></style>