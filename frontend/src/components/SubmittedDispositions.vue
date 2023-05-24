<template>
    <div>
        <h1>Submitted Dispositions</h1>

        <div v-for="disposition in dispositions" :key="disposition.id" class="disposition-container">
            <div>
                <h3>Candidate ID: {{ disposition.candidateId }}</h3>
                <h3>Status: {{ disposition.dispositionStatus }}</h3>
            </div>
            <div>
                <button @click="downloadDisposition(disposition.id)">Download Disposition</button>
                <button class="approve" @click="approveDisposition(disposition.id)">Approve</button>
                <button class="disapprove" @click="showCommentInput(disposition.id)">Disapprove</button>
            </div>
            <div v-if="currentDisposition === disposition.id">
                <input type="text" v-model="comment" placeholder="Enter a comment">
                <button @click="submitCommentAndDisapprove(disposition.id)">Submit Comment</button>
            </div>
        </div>
    </div>
    <div>
        <h1>Updated Dispositions</h1>

        <div v-for="dispositionUpd in dispositionsUpdated" :key="dispositionUpd.id" class="disposition-container">
            <div>
                <h3>Candidate ID: {{ dispositionUpd.candidateId }}</h3>
                <h3>Status: {{ dispositionUpd.dispositionStatus }}</h3>
            </div>
            <div>
                <button @click="downloadDisposition(dispositionUpd.id)">Download Disposition</button>
                <button class="approve" @click="approveDisposition(dispositionUpd.id)">Approve</button>
                <button class="disapprove" @click="showCommentInput(dispositionUpd.id)">Disapprove</button>
            </div>
            <div v-if="currentDisposition === dispositionUpd.id">
                <input type="text" v-model="comment" placeholder="Enter a comment">
                <button @click="submitCommentAndDisapprove(dispositionUpd.id)">Submit Comment</button>
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
            comment: '',
            currentDisposition: null,
            dispositionsUpdated: [],

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


            const dispositionUpdResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
            this.dispositionsUpdated = dispositionUpdResponse.data;


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

                const dispositionUpdResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
            this.dispositionsUpdated = dispositionUpdResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        showCommentInput(dispositionId) {
            this.currentDisposition = dispositionId;
        },
        async submitCommentAndDisapprove(dispositionId) {
            try {
                // Post the comment
                await axios.post(`http://localhost:3000/disposition/comment/${dispositionId}`, {
                    comment: this.comment,
                });
                this.comment = '';
                this.currentDisposition = null; // Hide the comment input

                // Then disapprove the disposition
                await this.disapproveDisposition(dispositionId);
            } catch (error) {
                console.error(error);
            }
        },
        async disapproveDisposition(dispositionId) {
            try {
                this.currentDisposition = dispositionId;
                this.inputVisible = true;
                await axios.post(`http://localhost:3000/disposition/disapprove-disposition/${dispositionId}`);
                // Refresh dispositions after disapproval
                const dispositionResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositions/${this.mentorId}`);
                this.dispositions = dispositionResponse.data;

                const dispositionUpdResponse = await axios.get(`http://localhost:3000/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
            this.dispositionsUpdated = dispositionUpdResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
    }
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>