<template>
  <div class="document-container">

    <h1 class="page-title">Documents Management</h1>

    <div class="split-container">

      <!-- ✅ LEFT: THEME -->
      <div class="box">
        <h2>Theme Form</h2>

        <form @submit.prevent="submitTheme">
          <input type="file" @change="onThemeFormChange" required />
          <button type="submit">Submit Theme</button>
        </form>

        <form @submit.prevent="updateTheme">
          <input type="file" @change="onUpdateThemeFormChange" required />
          <button class="update">Update Theme</button>
        </form>
      </div>

      <!-- ✅ RIGHT: DISPOSITION -->
      <div class="box">
        <h2>Disposition Form</h2>

        <form @submit.prevent="submitDisposition">
          <input type="file" @change="onDispositionFormChange" required />
          <button type="submit">Submit Disposition</button>
        </form>

        <form @submit.prevent="updateDisposition">
          <input type="file" @change="onUpdateDispositionFormChange" required />
          <button class="update">Update Disposition</button>
        </form>
      </div>

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

      const res = await axios.post('https://diplomainsight.onrender.com/document/create', formData);
      alert(res.data.message);
    },

    async submitDisposition() {
      const formData = new FormData();
      formData.append('blank_disposition', this.dispositionForm);

      const res = await axios.post('https://diplomainsight.onrender.com/document/create', formData);
      alert(res.data.message);
    },

    async updateTheme() {
      const formData = new FormData();
      formData.append('blank_theme', this.updateThemeForm);

      const res = await axios.put('https://diplomainsight.onrender.com/documents/1', formData);
      alert(res.data.message);
    },

    async updateDisposition() {
      const formData = new FormData();
      formData.append('blank_disposition', this.updateDispositionForm);

      const res = await axios.put('https://diplomainsight.onrender.com/documents/1', formData);
      alert(res.data.message);
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
}

.box {
  width: 420px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0,0,0,0.1);
}

.box h2 {
  margin-bottom: 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

input {
  padding: 10px;
}

button {
  padding: 10px;
  background: #007BFF;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
}

button.update {
  background: #28a745;
}
</style>
