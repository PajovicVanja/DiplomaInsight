<template>
    <div v-if="dispositions.length > 0">
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
    <div v-else class="disposition-container" style="display: flex;
      justify-content: center;
      align-items: center;">

        <h3>No dispositions submitted</h3>

    </div>

    <div v-if="dispositionsUpdated.length > 0">
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
    <div v-else class="disposition-container" style="display: flex;
      justify-content: center;
      align-items: center;">
        <h3>No dispositions updated</h3>
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
            axios.defaults.withCredentials = true;
            const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
            this.mentorId = response.data.id;

            const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositions/${this.mentorId}`);
            this.dispositions = dispositionResponse.data;


            const dispositionUpdResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
            this.dispositionsUpdated = dispositionUpdResponse.data;


        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        downloadDisposition(dispositionId) {
            window.open(`https://diplomainsight.onrender.com/disposition/download-disposition/${dispositionId}`);
        },
        async approveDisposition(dispositionId) {
            try {
                await axios.post(`https://diplomainsight.onrender.com/disposition/approve-disposition/${dispositionId}`, {
                    mentorId: this.mentorId,
                });
                const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositions/${this.mentorId}`);
                this.dispositions = dispositionResponse.data;

                const dispositionUpdResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
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
                await axios.post(`https://diplomainsight.onrender.com/disposition/comment/${dispositionId}`, {
                    comment: this.comment,
                });
                this.comment = '';
                this.currentDisposition = null; 

                await this.disapproveDisposition(dispositionId);
            } catch (error) {
                console.error(error);
            }
        },
        async disapproveDisposition(dispositionId) {
            try {
                this.currentDisposition = dispositionId;
                this.inputVisible = true;
                await axios.post(`https://diplomainsight.onrender.com/disposition/disapprove-disposition/${dispositionId}`);
                const dispositionResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositions/${this.mentorId}`);
                this.dispositions = dispositionResponse.data;

                const dispositionUpdResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/submitted-dispositionsUpdated/${this.mentorId}`);
                this.dispositionsUpdated = dispositionUpdResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
    }
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>