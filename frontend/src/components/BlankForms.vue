<template>
    <div>
      <h1>Submit Documents</h1>
  
      <form @submit.prevent="submitDocuments">
        <div>
          <label for="themeForm">Blank Theme Form:</label>
          <input type="file" id="themeForm" @change="onThemeFormChange" required>
        </div>
  
        <div>
          <label for="dispositionForm">Blank Disposition Form:</label>
          <input type="file" id="dispositionForm" @change="onDispositionFormChange" required>
        </div>
  
        <button type="submit">Submit</button>
      </form>
  
      <h1>Update Documents</h1>
  
      <form @submit.prevent="updateDocuments">
        <div>
          <label for="updateThemeForm">Updated Blank Theme Form:</label>
          <input type="file" id="updateThemeForm" @change="onUpdateThemeFormChange" required>
        </div>
  
        <div>
          <label for="updateDispositionForm">Updated Blank Disposition Form:</label>
          <input type="file" id="updateDispositionForm" @change="onUpdateDispositionFormChange" required>
        </div>
  
        <button type="submit">Update</button>
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
          const response = await axios.post('http://localhost:3000/document/create', formData, {
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
          const response = await axios.put('http://localhost:3000/documents/1', formData, {
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
  