<template>
    <div>
        <h1>Submitted Themes</h1>

        <div v-for="disposition in themed" :key="disposition.id" class="disposition-container">
            <div>
                <h3>Candidate ID: {{ disposition.candidateId }}</h3>
                <h3>Status: {{ disposition.status }}</h3>
            </div>
            <div>
                <button @click="downloadTheme(disposition.id)">Download Theme</button>
                <button class="approve" @click="acceptTheme(disposition.id)">Accept</button>
                <button class="disapprove" @click="declineTheme(disposition.id)">Decline</button>
            </div>
        </div>
    </div>
</template>

  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            mentorId: '',
            themed: [], // Holds the list of themed dispositions
        };
    },
    async created() {
        try {
            // Fetch the current user's ID
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/profile/current');
            this.mentorId = response.data.id;



            // Fetch themed dispositions
            const themedResponse = await axios.get(`http://localhost:3000/disposition/themed-dispositions/${this.mentorId}`);
            this.themed = themedResponse.data;
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        downloadTheme(dispositionId) {
            window.open(`http://localhost:3000/disposition/download-theme/${dispositionId}`);
        },
        async acceptTheme(dispositionId) {
            try {
                await axios.post(`http://localhost:3000/disposition/accept-theme/${dispositionId}`);
                const themedResponse = await axios.get(`http://localhost:3000/disposition/themed-dispositions/${this.mentorId}`);
                this.themed = themedResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        async declineTheme(dispositionId) {
            try {
                await axios.post(`http://localhost:3000/disposition/decline-theme/${dispositionId}`);
                const themedResponse = await axios.get(`http://localhost:3000/disposition/themed-dispositions/${this.mentorId}`);
                this.themed = themedResponse.data;
            } catch (error) {
                console.error(error);
            }
        },

    }
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>