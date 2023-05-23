<template>
    <div>
        <h1>Submitted Dispositions</h1>

        <div v-for="disposition in dispositions" :key="disposition.id">
            <h3>Candidate ID: {{ disposition.candidateId }}</h3>
            <h3>Status: {{ disposition.status }}</h3>
            <button @click="downloadDisposition(disposition.id)">Download Disposition</button>
            <button @click="approveDisposition(disposition.id)">Approve</button>
            <button @click="disapproveDisposition(disposition.id)">Disapprove</button>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            mentorId: '',  // This will be set by the current user's id
            dispositions: []  // This will hold the list of submitted dispositions
        };
    },
    async created() {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/profile/current');
            this.mentorId = response.data.id;

            // Fetch the list of submitted dispositions here
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
                    mentorId: this.mentorId
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
        }
    }
};
</script>
  