<template>
    <div>
        <h1>Submitted Dispositions</h1>

        <div v-for="disposition in dispositions" :key="disposition.id" class="disposition-container">
            <div>
                <h3>Candidate ID: {{ disposition.candidateId }}</h3>
                <h3>Status: {{ disposition.status }}</h3>
            </div>
            <div>
                <button @click="downloadDisposition(disposition.id)">Download Disposition</button>
                <button class="approve" @click="approveDisposition(disposition.id)">Approve</button>
                <button class="disapprove" @click="disapproveDisposition(disposition.id)">Disapprove</button>
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
            dispositions: [],
        };
    },
    async created() {
        try {
            // Fetch the current user's ID
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/profile/current');
            this.mentorId = response.data.id;

            // Fetch submitted dispositions
            const dispositionResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositions/${this.mentorId}`);
            this.dispositions = dispositionResponse.data;


        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        downloadDisposition(dispositionId) {
            window.open(`http://localhost:3000/disposition/download-disposition/${dispositionId}`);
        },
        async approveDisposition(dispositionId) {
            try {
                await axios.post(`http://localhost:3000/disposition/approve-disposition/${dispositionId}`, {
                    mentorId: this.mentorId,
                });
                // Refresh dispositions after approval
                const dispositionResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositions/${this.mentorId}`);
                this.dispositions = dispositionResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        async disapproveDisposition(dispositionId) {
            try {
                await axios.post(`http://localhost:3000/disposition/disapprove-disposition/${dispositionId}`);
                // Refresh dispositions after disapproval
                const dispositionResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositions/${this.mentorId}`);
                this.dispositions = dispositionResponse.data;
            } catch (error) {
                console.error(error);
            }
        },

    }
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>