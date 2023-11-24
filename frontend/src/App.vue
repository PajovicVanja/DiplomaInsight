<template>
  <div class="wrapper">
    <nav>
      <input type="checkbox" id="show-menu">
      <label for="show-menu" class="menu-icon"><i class="fas fa-bars"></i></label>
      <div class="content">
        <div class="logo" v-if="isCandidate"><a href="/" @click.prevent="showHomeStudent"><img class="logo-img"
              :src="logo" alt="DiplomaInsight logo" /></a></div>
        <div class="logo" v-if="!loggedIn"><a href="/"><img class="logo-img"
              :src="logo" alt="DiplomaInsight logo" /></a></div>
        <div class="logo" v-if="isUser"><a href="/" @click.prevent="showUserHome"><img class="logo-img"
              :src="logo" alt="DiplomaInsight logo" /></a></div>
        <div class="logo" v-if="isAdmin"><a href="/" @click.prevent="showAdmin"><img class="logo-img"
              :src="logo" alt="DiplomaInsight logo" /></a></div>
        <ul class="links">
          <li v-if="isCandidate">
            <a href="#" @click.prevent="showHomeStudent">Home</a>
          </li>
          <li v-if="isUser">
            <a href="#" @click.prevent="showUserHome">Home</a>
          </li>

          <li v-if="loggedIn && isUser || isCandidate">
            <a href="#" class="desktop-link">Diploma</a>
            <input type="checkbox" id="show-university">
            <label for="show-university">Diploma</label>
            <ul>
              <li v-if="isCandidate"><a href="#" @click.prevent="showDispositonRegistration">Disposition Submission</a>
              </li>
              <li v-if="isCandidate && dispStatus === 'Disposition Disapproved'"><a href="#"
                  @click.prevent="showDisaprovedComment">Disapproved</a></li>
              <li v-if="isCandidate && themeStatus === 'Theme Accepted'"><a href="#"
                  @click.prevent="showDownloadSigned">Download signed theme</a></li>
              <li v-if="isUser"><a href="#" @click.prevent="showDispositonReviewRegistration">Review Dispositions</a></li>
              <li v-if="isUser"><a href="#" @click.prevent="showSubmittedThemes">Review Themes</a></li>
              <li v-if="isUser"><a href="#" @click.prevent="showSubmittedThesis">Set deadlines and status</a></li>
            </ul>
          </li>
          <li v-if="isAdmin">
            <a href="#" @click.prevent="showAdmin">Admin</a>
          </li>
          <li v-if="isAdmin || isUser">
            <a href="#" @click.prevent="showBlankForms">Documents Upload</a>
          </li>

          <li v-if="loggedIn && isAdmin || isUser">
            <a href="#" class="desktop-link">Candidates</a>
            <input type="checkbox" id="show-candidates">
            <label for="show-candidates">Candidates</label>
            <ul>
              <li><a href="#" @click.prevent="showUserCreate">Create</a></li>
              <li><a href="#" @click.prevent="showDeleteCandidate">Delete</a></li>
            </ul>
          </li>

          <li v-if="loggedIn && isUser || isCandidate"><a href="#" @click.prevent="showUserProfile">Profile</a></li>
          <li v-if="isAdmin">
            <a href="#" class="desktop-link">University</a>
            <input type="checkbox" id="show-university">
            <label for="show-university">University</label>
            <ul>
              <li><a href="#" @click.prevent="showUniversity">Create</a></li>
              <li><a href="#" @click.prevent="showUniversityDel">Delete</a></li>
            </ul>
          </li>
          <li>
            <a href="#" class="desktop-link">Account</a>
            <input type="checkbox" id="show-account">
            <label for="show-account">Account</label>
            <ul>
              <li v-if="!loggedIn"><a href="#" @click.prevent="showLogin">Login</a></li>
              <li v-if="!loggedIn"><a href="#" @click.prevent="showRegister">Register</a></li>
              <li v-if="loggedIn">
                <a href="#">
                  <Logout @user-logged-out="logoutUser" />
                </a>
              </li>
            </ul>
          </li>
         
          <li>
            <a href="#" @click.prevent="showHelpComp">Help</a>
          </li>
        </ul>
      </div>

    </nav>
  </div>

  <div style="padding-top: 10%;" v-if="showLoginForm">
    <Login @hide-form="hideForms" @user-logged-in="checkSession" />
  </div>

  <div style="padding-top: 10%;" v-if="showRegisterForm">
    <Register @hide-form="hideForms" />
  </div>
  <div style="padding-top: 2%;" v-if="showUniversityForm">
    <UniversityForm @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showUniversityDelList">
    <DeleteUniversity @hide-form="hideForms" />
  </div>
  <div style="padding-top: 5%;" v-if="showUserCreateForm">
    <div class="center-content">
      <CreateCandidate @hide-form="hideForms" />
    </div>
  </div>
  <div style="padding-top: 10%;" v-if="showDeleteCandidateForm">
    <DeleteCandidateUser @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showUserProfileForm">
    <UserProfile @hide-form="hideForms" />
  </div>
  <div v-if="showAdminPage">
    <AdminPage @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showDispositionForm">
    <DispositionRegistration @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showDispositionReviewForm">
    <SubmittedDispositions @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showThemeSubmissionForm">
    <ThemeSubmission @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showSubmittedThemesForm">
    <SubmittedThemes @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showDisaprovedCommentForm">
    <DisaprovedComment @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showDownloadSignedForm">
    <DownloadSigned @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showBlankFormsForm">
    <BlankForms @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showHomeStudentForm">
    <HomeStudent @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="showSubmittedThesisForm">
    <SubmittedThesis @hide-form="hideForms" />
  </div>
  <div style="padding-top: 10%;" v-if="!loggedIn && !showLoginForm && !showRegisterForm && !showHelpCompForm">
    <DefaultHome @hide-form="hideForms"/>
</div>
  <div style="padding-top: 10% ;" v-if="showUserHomeForm">
    <UserHome @hide-form="hideForms"/>
</div>
  <div style="padding-top: 10% ;" v-if="showHelpCompForm">
    <HelpComp @hide-form="hideForms"/>
</div>
</template>

<script>
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Logout from './components/Logout.vue';
import CreateCandidate from './components/CreateCandidate.vue';
import UserProfile from './components/UserProfile.vue';
import UniversityForm from './components/UniversityForm.vue';
import DeleteUniversity from './components/DeleteUniversity.vue';
import AdminPage from './components/AdminPage.vue';
import DeleteCandidateUser from './components/DeleteCandidateUser.vue';
import DispositionRegistration from './components/DispositionRegistration.vue';
import SubmittedDispositions from './components/SubmittedDispositions.vue';
import ThemeSubmission from './components/ThemeSubmission.vue';
import SubmittedThemes from './components/SubmittedThemes.vue';
import DisaprovedComment from './components/DisaprovedComment.vue';
import DownloadSigned from './components/DownloadSigned.vue';
import BlankForms from './components/BlankForms.vue';
import HomeStudent from './components/HomeStudent.vue';
import SubmittedThesis from './components/SubmittedThesis.vue';
import DefaultHome from './components/DefaultHome.vue';
import UserHome from './components/UserHome.vue';
import HelpComp from './components/HelpComp.vue';



import axios from 'axios';
import logo from '@/assets/logoo.png';

export default {
  name: 'App',
  components: {
    Login,
    Register,
    Logout,
    CreateCandidate,
    UniversityForm,
    DeleteUniversity,
    UserProfile,
    AdminPage,
    DeleteCandidateUser,
    DispositionRegistration,
    SubmittedDispositions,
    ThemeSubmission,
    SubmittedThemes,
    DisaprovedComment,
    DownloadSigned,
    BlankForms,
    HomeStudent,
    SubmittedThesis,
    DefaultHome,
    UserHome,
    HelpComp,

  },

  data() {
    return {
      logo,
      userID: null,
      themeStatus: null,
      dispStatus: null,
      showLoginForm: false,
      showRegisterForm: false,
      showUserCreateForm: false,
      loggedIn: false,
      showUniversityForm: false,
      showUniversityDelList: false,
      showUserProfileForm: false,
      showDeleteCandidateForm: false,
      showAdminPage: false,
      isAdmin: false,
      isUser: false,
      isCandidate: false,
      showDispositionForm: false,
      showDispositionReviewForm: false,
      showThemeSubmissionForm: false,
      showSubmittedThemesForm: false,
      showDisaprovedCommentForm: false,
      showDownloadSignedForm: false,
      showBlankFormsForm: false,
      showHomeStudentForm: false,
      showSubmittedThesisForm: false,
      showUserHomeForm: false,
      showHelpCompForm: false,
    };
  },
  async created() {
    await this.checkSession();
  },

  methods: {
    async checkSession() {
      try {
        const response = await axios.get('http://localhost:3000/check-session', { withCredentials: true });
        if (response.data.loggedIn) {
          this.loggedIn = true;
          this.isAdmin = response.data.user.role === 'admin';
          this.isUser = response.data.user.role === 'user';
          this.isCandidate = response.data.user.role === 'candidate';
          this.userID = response.data.user.id;
          if (this.isCandidate) {
            this.fetchDispositionStatus();
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    fetchDispositionStatus() {
      if (this.userID !== null) {
        axios.get(`http://localhost:3000/disposition/status/${this.userID}`)
          .then(response => {
            this.themeStatus = response.data.currentThemeStatus;
          })
          .catch(error => {
            console.error('Error fetching disposition status:', error);
          });
      }
      if (this.userID !== null) {
        axios.get(`http://localhost:3000/disposition/statusDisp/${this.userID}`)
          .then(response => {
            this.dispStatus = response.data.currentThemeStatus;
          })
          .catch(error => {
            console.error('Error fetching disposition status:', error);
          });
      }
    },
    logoutUser() {
      this.loggedIn = false;
      this.isAdmin = false;
      this.isUser = false;
      this.isCandidate = false;
      this.hideForms();
    },
    showUniversity() {
      this.hideForms();
      this.showUniversityForm = true;
    },
    showUniversityDel() {
      this.hideForms();
      this.showUniversityDelList = true;
    },
    showLogin() {
      this.hideForms();
      this.showLoginForm = true;
    },
    showRegister() {
      this.hideForms();
      this.showRegisterForm = true;
    },
    showUserCreate() {
      this.hideForms();
      this.showUserCreateForm = true;
    },
    showDeleteCandidate() {
      this.hideForms();
      this.showDeleteCandidateForm = true;
    },
    showUserProfile() {
      this.hideForms();
      this.showUserProfileForm = true;
    },
    showAdmin() {
      this.hideForms();
      this.showAdminPage = true;
    },
    showDispositonRegistration() {
      this.hideForms();
      this.showDispositionForm = true;
    },
    showDispositonReviewRegistration() {
      this.hideForms();
      this.showDispositionReviewForm = true;
    },
    showThemeSubmission() {
      this.hideForms();
      this.showThemeSubmissionForm = true;
    },
    showSubmittedThemes() {
      this.hideForms();
      this.showSubmittedThemesForm = true;
    },
    showDisaprovedComment() {
      this.hideForms();
      this.showDisaprovedCommentForm = true;
    },
    showDownloadSigned() {
      this.hideForms();
      this.showDownloadSignedForm = true;
    },
    showBlankForms() {
      this.hideForms();
      this.showBlankFormsForm = true;
    },
    showHomeStudent() {
      this.hideForms();
      this.showHomeStudentForm = true;
    },
    showSubmittedThesis() {
      this.hideForms();
      this.showSubmittedThesisForm = true;
    },
    showUserHome() {
      this.hideForms();
      this.showUserHomeForm = true;
    },
    showHelpComp() {
      this.hideForms();
      this.showHelpCompForm = true;
    },

    hideForms() {
      this.showLoginForm = false;
      this.showRegisterForm = false;
      this.showUserCreateForm = false;
      this.showUniversityForm = false;
      this.showUniversityDelList = false;
      this.showUserProfileForm = false;
      this.showDeleteCandidateForm = false;
      this.showAdminPage = false;
      this.showDispositionForm = false;
      this.showDispositionReviewForm = false;
      this.showThemeSubmissionForm = false;
      this.showSubmittedThemesForm = false;
      this.showDisaprovedCommentForm = false;
      this.showDownloadSignedForm = false;
      this.showBlankFormsForm = false;
      this.showHomeStudentForm = false;
      this.showSubmittedThesisForm = false;
      this.showUserHomeForm = false;
      this.showHelpCompForm = false;
    },
  },
};
</script>
<style src="./css/App.css" scoped></style>
<style scoped>
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>

