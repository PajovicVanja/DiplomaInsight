<template>
  <div class="document-container">
    <h1 class="header">Submit Documents</h1>

    <form @submit.prevent="submitDocuments" class="form-container">
      <div class="form-group">
        <label for="themeForm" class="form-label">Blank Theme Form:</label>
        <input type="file" id="themeForm" class="form-input" @change="onThemeFormChange" required>
      </div>

      <div class="form-group">
        <label for="dispositionForm" class="form-label">Blank Disposition Form:</label>
        <input type="file" id="dispositionForm" class="form-input" @change="onDispositionFormChange" required>
      </div>

      <button type="submit" class="submit-btn">Submit</button>
    </form>

    <h1 class="header">Update Documents</h1>

    <form @submit.prevent="updateDocuments" class="form-container">
      <div class="form-group">
        <label for="updateThemeForm" class="form-label">Updated Blank Theme Form:</label>
        <input type="file" id="updateThemeForm" class="form-input" @change="onUpdateThemeFormChange" required>
      </div>

      <div class="form-group">
        <label for="updateDispositionForm" class="form-label">Updated Blank Disposition Form:</label>
        <input type="file" id="updateDispositionForm" class="form-input" @change="onUpdateDispositionFormChange" required>
      </div>

      <button type="submit" class="update-btn">Update</button>
    </form>
  </div>
</template>

  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      themeForm: null,
      dispositionForm: null,
      updateThemeForm: null,
      updateDispositionForm: null
    };
  },
  methods: {
    onThemeFormChange(e) {
      this.themeForm = e.target.files[0];
    },
    onDispositionFormChange(e) {
      this.dispositionForm = e.target.files[0];
    },
    onUpdateThemeFormChange(e) {
      this.updateThemeForm = e.target.files[0];
    },
    onUpdateDispositionFormChange(e) {
      this.updateDispositionForm = e.target.files[0];
    },
    async submitDocuments() {
      const formData = new FormData();
      formData.append('blank_theme', this.themeForm);
      formData.append('blank_disposition', this.dispositionForm);

      try {
        const response = await axios.post('https://diplomainsight.onrender.com/document/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert(response.data.message);
      } catch (error) {
        console.error(error);
        alert('An error occurred while submitting the documents.');
      }
    },
    async updateDocuments() {
      const formData = new FormData();
      formData.append('blank_theme', this.updateThemeForm);
      formData.append('blank_disposition', this.updateDispositionForm);

      try {
        const response = await axios.put('https://diplomainsight.onrender.com/documents/1', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert(response.data.message);
      } catch (error) {
        console.error(error);
        alert('An error occurred while updating the documents.');
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.document-container {
  background-color: #f4ebeb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 3em;
}

.header {
  color: #333;
  margin-bottom: 1em;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding-bottom: 30px;
}

.form-group {
  margin-bottom: 1em;
}

.form-label {
  margin-bottom: 0.5em;
}

.form-input {
  padding: 0.5em;
}

.submit-btn, .update-btn {
  padding: 0.5em 1em;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn {
  background-color: #007BFF;
}

.submit-btn:hover {
  background-color: #0069d9;
}

.update-btn {
  background-color: #28a745;
}

.update-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .form-container {
    width: 100%;
  }
}

</style>
  