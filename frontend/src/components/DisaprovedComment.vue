<template>
    <div>
        <h1>Mentors Comment</h1>
        <p>{{ comment }}</p>
    </div>
    <div>
        <h1>Update Your Disposition</h1>

        <form @submit.prevent="registerThesis">
            <div>
                <label for="disposition">Proposal Document:</label>
                <input type="file" id="disposition" @change="onFileChange" required>
            </div>

            <div>
                <label for="mentor">Select Mentor:</label>
                <select id="mentor" v-model="mentorId" required>
                    <option disabled value="">Please select a mentor</option>
                    <option v-for="mentor in mentors" :key="mentor.id" :value="mentor.id">
                        {{ mentor.name }}
                    </option>
                </select>
            </div>

            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
    <div>
    <ThemeSubmission />
  </div>
</template>

<script>
import axios from 'axios';
import ThemeSubmission from './ThemeSubmission.vue';


export default {
    components:{
    ThemeSubmission
  },
    data() {
        return {
            dispositionId: null,  // Initialize it with a null value
            candidateId: '',
            comment: '',
            mentorId: '', 
            mentors: [],  
        };
    },
    async created() {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/profile/current');
            this.candidateId = response.data.id;
            console.log("current s" + this.candidateId)

            // Fetch the comment
            const commentResponse = await axios.get(`http://localhost:3000/disposition/comment/${this.candidateId}`);
            this.comment = commentResponse.data.comment;

            const mentorResponse = await axios.get('http://localhost:3000/disposition/mentor');
            this.mentors = mentorResponse.data;

            const dispositionResponse = await axios.get(`http://localhost:3000/disposition/${this.candidateId}`);
            this.dispositionId = dispositionResponse.data.id; // Get the disposition ID
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        onFileChange(e) {
            this.disposition = e.target.files[0];
        },
        async registerThesis() {
            const formData = new FormData();
            formData.append('disposition', this.disposition);
            formData.append('candidateId', this.candidateId);
            formData.append('mentorId', this.mentorId);

            try {
                const response = await axios.put(`http://localhost:3000/disposition/updateDisposition/${this.dispositionId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                alert(response.data.message);
            } catch (error) {
                console.error(error);
                alert('An error occurred while submitting your thesis proposal.');
            }
        }
    }
};
</script>
