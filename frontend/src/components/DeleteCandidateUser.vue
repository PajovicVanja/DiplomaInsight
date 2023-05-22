<template>
    <div class="register-container">
        <h4 class="delete-candidate-heading">Delete a Candidate</h4>
        <ul>
            <li v-for="candidate in candidates" :key="candidate.id" class="candidate">
                 {{ candidate.name }}
                <button class="delete-btn" @click="deleteCandidate(candidate.id)">Delete</button>
                <button class="edit-btn" @click="startEditing(candidate)">Edit</button>

                <div v-if="editingCandidateId === candidate.id" class="edit-form-container">
                    <form @submit.prevent="submitForm" class="edit-form">
                        <label for="name">Name:</label>
                        <input type="text" id="name" v-model="editingCandidate.name" class="input-field">
                        <label for="studyDirection">Study Direction:</label>
                        <input type="text" id="studyDirection" v-model="editingCandidate.studyDirection"
                            class="input-field">
                        <label for="university">University:</label>
                        <input type="text" id="university" v-model="editingCandidate.university" class="input-field">
                        <label for="faculty">Faculty:</label>
                        <input type="text" id="faculty" v-model="editingCandidate.faculty" class="input-field">
                        <label for="enrollmentNumber">Enrollment Number:</label>
                        <input type="text" id="enrollmentNumber" v-model="editingCandidate.enrollmentNumber"
                            class="input-field">
                        <label for="email">Email:</label>
                        <input type="email" id="email" v-model="editingCandidate.email" class="input-field">

                    

                         <button type="submit" class="submit-btn">Update Candidate</button>
                    </form>
                </div>
            </li>
        </ul>
    </div>
</template>
<style src="../css/deleteCandidate.css" scoped></style>
    
    
    
    
<script>
import axios from 'axios';



export default {
    data() {
        return {
            candidates: [],
            editingCandidateId: null,
            editingCandidate: {
                name: '',
                studyDirection: '',
                university: '',
                faculty: '',
                enrollmentNumber: '',
                email: ''
            }
        };
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:3000/candidate');
            this.candidates = response.data;
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        startEditing(candidate) {
            this.editingCandidateId = candidate.id;
            this.editingCandidate = { ...candidate };
        },
        async submitForm() {
            try {
                await axios.put(`http://localhost:3000/candidate/${this.editingCandidateId}`, this.editingCandidate);
                const index = this.candidates.findIndex(candidate => candidate.id === this.editingCandidateId);
                this.candidates[index] = this.editingCandidate;
                this.editingCandidateId = null;
                this.editingCandidate = { name: '', studyDirection: '', university: '', faculty: '', enrollmentNumber: '', email: '' };
            } catch (error) {
                console.error(error);
            }
        },
        async deleteCandidate(id) {
            try {
                await axios.delete(`http://localhost:3000/candidate/${id}`);
                this.candidates = this.candidates.filter((candidate) => candidate.id !== id);
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>