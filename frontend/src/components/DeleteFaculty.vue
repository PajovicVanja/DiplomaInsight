<template>
  <div>
      <h4>Delete a Faculty</h4>
    <ul>
      <li v-for="faculty in faculties" :key="faculty.id">
        {{ faculty.name }}, university - {{ getUniversityName(faculty.university_id) }}
        <button @click="deleteFaculty(faculty.id)">Delete</button>
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
    componentKey: 0
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
