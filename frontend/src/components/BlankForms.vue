<template>
  <div class="document-container">

    <h1 class="main-title">Document Management</h1>

    <!-- ✅ THEME SECTION -->
    <div class="section-card theme-section">
      <h2>Theme Form</h2>

      <form @submit.prevent="submitTheme">
        <div class="form-group">
          <label>Upload New Theme Form:</label>
          <input type="file" @change="onThemeFormChange" required />
        </div>

        <button type="submit" class="submit-btn">Submit Theme</button>
      </form>

      <form @submit.prevent="updateTheme" class="update-form">
        <div class="form-group">
          <label>Update Existing Theme Form:</label>
          <input type="file" @change="onUpdateThemeFormChange" required />
        </div>

        <button type="submit" class="update-btn">Update Theme</button>
      </form>
    </div>

    <!-- ✅ DISPOSITION SECTION -->
    <div class="section-card disposition-section">
      <h2>Disposition Form</h2>

      <form @submit.prevent="submitDisposition">
        <div class="form-group">
          <label>Upload New Disposition Form:</label>
          <input type="file" @change="onDispositionFormChange" required />
        </div>

        <button type="submit" class="submit-btn">Submit Disposition</button>
      </form>

      <form @submit.prevent="updateDisposition" class="update-form">
        <div class="form-group">
          <label>Update Existing Disposition Form:</label>
          <input type="file" @change="onUpdateDispositionFormChange" required />
        </div>

        <button type="submit" class="update-btn">Update Disposition</button>
      </form>
    </div>

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

    async submitTheme() {
      const formData = new FormData();
      formData.append('blank_theme', this.themeForm);

      try {
        const response = await axios.post(
          'https://diplomainsight.onrender.com/document/create',
          formData
        );
        alert(response.data.message);
      } catch (error) {
        alert('Error while submitting theme.');
      }
    },

    async updateTheme() {
      const formData = new FormData();
      formData.append('blank_theme', this.updateThemeForm);

      try {
        const response = await axios.put(
          'https://diplomainsight.onrender.com/documents/1',
          formData
        );
        alert(response.data.message);
      } catch (error) {
        alert('Error while updating theme.');
      }
    },

    async submitDisposition() {
      const formData = new FormData();
      formData.append('blank_disposition', this.dispositionForm);

      try {
        const response = await axios.post(
          'https://diplomainsight.onrender.com/document/create',
          formData
        );
        alert(response.data.message);
      } catch (error) {
        alert('Error while submitting disposition.');
      }
    },

    async updateDisposition() {
      const formData = new FormData();
      formData.append('blank_disposition', this.updateDispositionForm);

      try {
        const response = await axios.put(
          'https://diplomainsight.onrender.com/documents/1',
          formData
        );
        alert(response.data.message);
      } catch (error) {
        alert('Error while updating disposition.');
      }
    }
  }
};
</script>

<style scoped>

.document-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: bold;
}

.section-card {
  background: white;
  width: 100%;
  max-width: 700px;
  padding: 30px;
  margin-bottom: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.section-card h2 {
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-group input {
  padding: 8px;
}

.submit-btn {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}

.update-btn {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0069d9;
}

.update-btn:hover {
  background-color: #218838;
}

.update-form {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

</style>
