<template>
    <div class="help">
      <h1>Help and Support</h1>
      <p>We're here to assist you. If you have any questions about using our platform, here are a few topics that might help:</p>
      <div class="help-topic">
        <h2>How to Register</h2>
        <p>If you're a new user, click on the 'Register' button on the home page. Fill in your details and submit the form. You will receive a confirmation email with further instructions.</p>
      </div>
      <div class="help-topic">
        <h2>Submitting a Thesis Proposal</h2>
        <p>Once you're logged in, you can navigate to the 'Submit Proposal' page. Here, you can upload your thesis proposal and select a mentor from the available list.</p>
      </div>
      <div class="help-topic">
        <h2>Checking Your Progress</h2>
        <p>Go to your profile page and you can view the progress of your thesis proposal, along with the assigned mentor and upcoming deadlines.</p>
      </div>
      <div class="help-topic">
        <h2>Need More Help?</h2>
        <p>If you need further assistance, please don't hesitate to contact us at diplomainsight@gmail.com. We're here to help you!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HelpComp',
  };
  </script>
  
  <style scoped>
  .help {
    max-width: 800px;
    margin: 0 auto;
    padding: 1em;
  }
  
  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 1em;
  }
  
  .help-topic {
    margin-bottom: 2em;
  }
  
  h2 {
    color: #007BFF;
    margin-bottom: 0.5em;
  }
  
  p {
    line-height: 1.5;
  }
  </style>
  