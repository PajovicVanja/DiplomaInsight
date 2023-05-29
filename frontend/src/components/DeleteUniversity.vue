<template>
  <div>
    <h4>Delete a University</h4>
    <ul>
      <li v-for="university in universities" :key="university.id">
        {{ university.name }}
        <button @click="deleteUniversity(university.id)">Delete</button>
        <button @click="startEditing(university)">Edit</button>
        
        <div v-if="editingUniversityId === university.id">
          <form @submit.prevent="submitForm">
            <label for="name">University Name:</label>
            <input type="text" id="name" v-model="editingUniversity.name">
            <input type="text" id="location" v-model="editingUniversity.location">

            <button type="submit">Update University</button>
          </form>
        </div>
      </li>
    </ul>
  </div>
  <div>
    <DeleteFaculty :key="componentKey"></DeleteFaculty>
  </div>
</template>

<script>
import axios from 'axios';
import DeleteFaculty from './DeleteFaculty.vue';

export default {
  components: {
    DeleteFaculty
  },
  data() {
    return {
      universities: [],
      componentKey: 0,
      editingUniversityId: null,
      editingUniversity: {
        name: '',
        location: '',
      }
    };
  },
  async created() {
    try {
      const response = await axios.get('https://diplomainsight.onrender.com/university');
      this.universities = response.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    startEditing(university) {
      this.editingUniversityId = university.id;
      this.editingUniversity = { ...university };
    },
    async submitForm() {
      try {
        await axios.put(`https://diplomainsight.onrender.com/university/${this.editingUniversityId}`, this.editingUniversity);
        const index = this.universities.findIndex(university => university.id === this.editingUniversityId);
        this.universities[index] = this.editingUniversity;
        this.editingUniversityId = null;
        this.editingUniversity = { name: '', location: '' };
        this.componentKey += 1;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUniversity(id) {
      try {
        await axios.delete(`https://diplomainsight.onrender.com/university/${id}`);
        this.universities = this.universities.filter((university) => university.id !== id);
        this.componentKey += 1;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style src="../css/DeletingList.css" scoped></style>