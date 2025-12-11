<template>
  <div class="document-container">

    <h1 class="page-title">Documents Management</h1>

    <div class="split-container">

      <!-- LEFT: THEME -->
      <div class="box">
        <h2>Theme Form</h2>

        <input type="file" @change="onThemeFormChange" />
      </div>

      <!-- RIGHT: DISPOSITION -->
      <div class="box">
        <h2>Disposition Form</h2>

        <input type="file" @change="onDispositionFormChange" />
      </div>

    </div>

    <!-- ONE SUBMIT BUTTON FOR BOTH -->
    <div class="submit-section">
      <button class="submit-btn" @click="submitDocuments">
        Submit Both Documents
      </button>
    </div>

    <!-- UPDATE SECTION -->
    <h2 class="update-title">Update Existing Documents</h2>

    <div class="split-container">

      <div class="box">
        <h3>Update Theme</h3>
        <input type="file" @change="onUpdateThemeFormChange" />
      </div>

      <div class="box">
        <h3>Update Disposition</h3>
        <input type="file" @change="onUpdateDispositionFormChange" />
      </div>

    </div>

    <div class="submit-section">
      <button class="update-btn" @click="updateDocuments">
        Update Both Documents
      </button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

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

    // SUBMIT BOTH (NEW DOCUMENTS)
    async submitDocuments() {
      if (!this.themeForm || !this.dispositionForm) {
        alert("Please upload BOTH Theme and Disposition forms before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("blank_theme", this.themeForm);
      formData.append("blank_disposition", this.dispositionForm);

      try {
        const res = await axios.post(
          "https://diplomainsight.onrender.com/document/create",
          formData
        );
        alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert("Error uploading documents.");
      }
    },

    // UPDATE BOTH (UPDATED DOCUMENTS)
    async updateDocuments() {
      if (!this.updateThemeForm || !this.updateDispositionForm) {
        alert("Please upload BOTH updated documents.");
        return;
      }

      const formData = new FormData();
      formData.append("blank_theme", this.updateThemeForm);
      formData.append("blank_disposition", this.updateDispositionForm);

      try {
        const res = await axios.put(
          "https://diplomainsight.onrender.com/documents/1",
          formData
        );
        alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert("Error updating documents.");
      }
    }
  }
};
</script>

<style scoped>
.document-container {
  padding: 40px;
  background: #f7f9fc;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
}

.split-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-bottom: 30px;
}

.box {
  width: 420px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0,0,0,0.1);
}

.box h2, .box h3 {
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-section {
  text-align: center;
  margin-bottom: 40px;
}

.submit-btn {
  padding: 12px 22px;
  background: #007BFF;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px;
}

.update-btn {
  padding: 12px 22px;
  background: #28a745;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px;
}

.update-title {
  text-align: center;
  margin-top: 50px;
}
</style>
