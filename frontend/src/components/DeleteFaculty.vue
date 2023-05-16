<template>
  <div>
    <h4>Delete a Faculty</h4>
    <ul>
      <li v-for="faculty in faculties" :key="faculty.id">
        {{ faculty.name }}, university - {{ getUniversityName(faculty.university_id) }}
        <button @click="deleteFaculty(faculty.id)">Delete</button>
        <button @click="startEditing(faculty)">Edit</button>
        
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

            <button type="submit">Update Faculty</button>
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
        axios.get('http://localhost:3000/faculty'),
        axios.get('http://localhost:3000/university')
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
        await axios.put(`http://localhost:3000/faculty/${this.editingFacultyId}`, this.editingFaculty);
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
        await axios.delete(`http://localhost:3000/faculty/${id}`);
        this.faculties = this.faculties.filter((faculty) => faculty.id !== id);
        this.componentKey += 1;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
