<template>
    <div v-if="themed.length > 0">
        <h1>Submitted Themes</h1>

        <div v-for="disposition in themed" :key="disposition.id" class="disposition-container">
            <div>
                <h3>Candidate ID: {{ disposition.candidateId }}</h3>
                <h3>Status: {{ disposition.themeStatus }}</h3>
            </div>
            <div>
                <button @click="downloadTheme(disposition.id)">Download Theme</button>
                <button class="disapprove" @click="declineTheme(disposition.id)">Decline</button>
            </div>
            <div>
  <form @submit.prevent="uploadSignedTheme(disposition.id)">
    <input type="file" @change="onFileChange">
    <button type="submit">Submit</button>
  </form>
</div>

        </div>
    </div>

    <div v-else class="disposition-container" style="display: flex;
      justify-content: center;
      align-items: center;">

        <h3>No themes submitted</h3>

    </div>
</template>

  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            mentorId: '',
            themed: [], 
            selectedFile: null,  

        };
    },
    async created() {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
            this.mentorId = response.data.id;


            const themedResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/themed-dispositions/${this.mentorId}`);
            this.themed = themedResponse.data;
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        downloadTheme(dispositionId) {
            window.open(`https://diplomainsight.onrender.com/disposition/download-theme/${dispositionId}`);
        },
        async acceptTheme(dispositionId) {
            try {
                await axios.post(`https://diplomainsight.onrender.com/disposition/accept-theme/${dispositionId}`);
                const themedResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/themed-dispositions/${this.mentorId}`);
                this.themed = themedResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        async declineTheme(dispositionId) {
            try {
                await axios.post(`https://diplomainsight.onrender.com/disposition/decline-theme/${dispositionId}`);
                const themedResponse = await axios.get(`https://diplomainsight.onrender.com/disposition/themed-dispositions/${this.mentorId}`);
                this.themed = themedResponse.data;
            } catch (error) {
                console.error(error);
            }
        },
        onFileChange(e) {
    this.selectedFile = e.target.files[0];
  },
  async uploadSignedTheme(dispositionId) {
    if (!this.selectedFile) {
        return alert('No file selected!');
    }

    const formData = new FormData();
    formData.append('signedTheme', this.selectedFile);

    try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post(`https://diplomainsight.onrender.com/disposition/uploadSignedTheme/${dispositionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        await this.acceptTheme(dispositionId);
    } catch (error) {
        console.error(error);
    }
},


    },
    
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>