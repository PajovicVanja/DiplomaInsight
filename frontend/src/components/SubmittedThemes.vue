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
                <!-- <button class="approve" @click="acceptTheme(disposition.id)">Accept</button> -->
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
            themed: [], // Holds the list of themed dispositions
            selectedFile: null,  // Holds the selected file

        };
    },
    async created() {
        try {
            // Fetch the current user's ID
            axios.defaults.withCredentials = true;
            const response = await axios.get('https://diplomainsight.onrender.com/profile/current');
            this.mentorId = response.data.id;
console.log(this.mentorId);


            // Fetch themed dispositions
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
        const response = await axios.post(`https://diplomainsight.onrender.com/disposition/uploadSignedTheme/${dispositionId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data); // Log the response from the server

        // Call the acceptTheme method here if the upload was successful
        await this.acceptTheme(dispositionId);
    } catch (error) {
        console.error(error);
    }
},


    },
    
};
</script>
<style scoped src="../css/SubmittedDispositions.css"></style>