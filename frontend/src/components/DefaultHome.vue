<template>
    <div class="home">
      <h1 class="title">Welcome to Our Website!</h1>
      <p class="intro">We are pleased to offer a myriad of services to meet your needs. Please take the time to explore our offerings.</p>
  
      <!-- Showcase some main features of your website -->
      <div class="feature-section student-section">
        <h2 class="section-title">Features for Students</h2>
        <div class="feature-container">
          <div class="feature-item">
            <h3 class="feature-title">Disposition Submission</h3>
            <p class="feature-desc">Our platform enables students to submit dispositions to mentors with utmost convenience.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Theme Form Submission</h3>
            <p class="feature-desc">Similar to dispositions, theme forms can be submitted seamlessly through our platform.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Progress Tracking</h3>
            <p class="feature-desc">Our system provides tools for tracking your current disposition/theme status, along with personalized suggestions for subsequent steps.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Deadline Management</h3>
            <p class="feature-desc">Our platform provides reminders of your impending diploma deadlines, ensuring you never miss a due date.</p>
          </div>
        </div>
      </div>

      <div class="feature-section professor-section">
        <h2 class="section-title">Features for Professors</h2>
        <div class="feature-container">
          <div class="feature-item">
            <h3 class="feature-title">Disposition Review</h3>
            <p class="feature-desc">Our application allows professors to download, accept, or decline submitted dispositions in a streamlined manner.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Theme Management</h3>
            <p class="feature-desc">Just as with dispositions, theme submissions can be managed directly within our application.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Candidate Creation</h3>
            <p class="feature-desc">The responsibility of adding candidates to the system falls to the professors or administrators.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Deadline Settings</h3>
            <p class="feature-desc">Professors can set and modify deadlines, adjust the current status of a student's diploma, and even extend deadlines if necessary.</p>
          </div>
        </div>
      </div>
  
      <!-- CTA section -->
      <div class="cta-section">
        <h2 class="cta-title">Commence Utilization</h2>
        <p class="cta-desc">Students are invited to sign in using the email and password provided by their professors in order to utilize our application.</p>
        <p class="cta-desc">Professors are encouraged to sign in or create a new account to begin leveraging our application's resources.</p>
      </div>
    </div>
</template>
  
<style scoped>
.home {
    padding: 20px;
    color: #333;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    color: #135589;
    text-align: center;
    padding: 20px;
}

.intro {
    margin-bottom: 40px;
    text-align: center;
    color: #555;
    max-width: 800px;
}

.feature-section {
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 800px;
}

.section-title {
    color: #135589;
    font-size: 1.2em;
    margin-bottom: 15px;
}

.feature-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.feature-item {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    flex: 0 0 48%;
}

.student-section .feature-item {
    border: 2px solid #88c9a1;
}

.professor-section .feature-item {
    border: 2px solid #90ccf4;
}

.feature-title {
    color: #135589;
    font-size: 1.1em;
    margin-bottom: 5px;
}

.feature-desc {
    color: #555;
}

.cta-section {
    background-color: #e0f7fa;
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 800px;
}

.cta-title {
    color: #135589;
    font-size: 1.2em;
    margin-bottom: 15px;
}

.cta-desc {
    color: #555;
    margin-bottom: 10px;
}
</style>
  