<script>
import WarningAlert from "@/components/WarningAlert.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import InfoModal from "@/components/InfoModal.vue";
import SideText from "@/components/SideText.vue";

import UserDataService from "../services/UserDataService.js";

export default {
  name: "login-view",
  components: {
    WarningAlert, LoadingSpinner, InfoModal, SideText
  },
  props: {
    checkAuthStatus: Function, // Declare the prop
  },
  data() {
    return {
      username: "",
      password: "",

      incorrect_login_message: "",

      updated_password: 0,
      activated_account: 0,

      loading: false
    };
  },
  created() {

    // CLEAR USER TOKEN FROM URL AFER UPDATED PASSWORD
    if (this.$route.query.updated_password) {
      this.updated_password = 1
      this.$router.replace({ name: 'login' });
    }

    // ACTIVATE USER'S ACCOUNT AFTER CONFIRMING EMAIL
    if (this.$route.query.jwt && this.$route.query.access_token) {

      const jwt = this.$route.query.jwt
      const access_token = this.$route.query.access_token

      // CLEAR USER TOKEN FROM URL AFER UPDATED PASSWORD
      this.$router.replace({ name: 'login' });

      UserDataService.findByToken(jwt, access_token)
        .then(response => {
          if (response.data.length != 0) {

            UserDataService.activateAccount(response.data.id)
              .then(response => {
                if (response.data.success) {
                  this.activated_account = 1
                }
              })
              .catch(error => {
                console.error("An error occurred while activating user:", error);
              });
          }
          else {
            this.$router.replace({ name: 'login' });
            return
          }
        })
        .catch(error => {
          // Handle errors
          console.error("An error occurred while retrieving user:", error);
        });
    }
  },
  methods: {
    login() {

      this.incorrect_login_message = ""
      this.loading = false

      const userData = {
        username: this.username,
        password: this.password
      }

      // Call the service to save user
      UserDataService.login(userData, { withCredentials: true })
        .then(async response => {
          // Handle successful login
          if (response.data.success) {
            console.log('Login successful', response);

            this.loading = true

            this.$router.push({ name: 'home_page', query: {} });

            this.checkAuthStatus();
          } else {
            console.log("Login failed", response)
            this.incorrect_login_message = response.data.message
          }
        })
        .catch(error => {
          // Handle errors
          console.error("An error occurred while logging in:", error);
        });
    },
    closeModal() {
      this.updated_password = false;
      this.activated_account = false;
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // Add a delay before the route change is allowed
  //   setTimeout(() => {
  //     next(); // Continue the route transition after a delay
  //   }, 1000); // 1-second delay
  // }
};

</script>

<template>
  <div>
    <!-- UPDATED PASSWORD AND ACTIVATED ACCOUNT MODAL -->

    <InfoModal v-if="updated_password" @closeModal="closeModal" header_message="Password Updated"
      body_message="Your password has been updated successfully!" />

    <InfoModal v-if="activated_account" @closeModal="closeModal" header_message="Account Activated"
      body_message="Your account has been activated! You can now login!" />


    <section class="gradient-custom-1 vh-100 p-3 py-md-5 py-xl-8">
      <div class="container">
        <div class="row gy-4 align-items-center">

          <!-- SIDE TEXT -->
          <div class="col-12 col-md-6 col-xl-7">
            <SideText />
          </div>

          <!-- LOGIN DIV -->
          <div class="col-12 col-md-6 col-xl-5">
            <div class="card border-0 rounded-4">
              <div class="card-body p-3 p-md-4 p-xl-5">
                <div class="row">
                  <div class="col-12">
                    <div class="mb-4">
                      <h3>Log in</h3>
                      <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                  </div>
                </div>

                <!-- FORM -->
                <form class="login-form" @submit.prevent="login">
                  <div class="row gy-3 overflow-hidden">

                    <!-- USERNAME -->
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input v-model="username" type="text" class="form-control" name="username" id="username"
                          placeholder="Username" required>
                        <label for="username" class="form-label">Username</label>
                      </div>
                    </div>

                    <!-- PASSWORD -->
                    <div class="col-12">
                      <div class="form-floating mb-3">
                        <input v-model="password" type="password" class="form-control" name="password" id="password"
                          value="" placeholder="Password" required>
                        <label for="password" class="form-label">Password</label>
                      </div>
                    </div>

                    <!-- KEEP ME LOGGED IN -->
                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me">
                        <label class="form-check-label text-secondary" for="remember_me">
                          Keep me logged in
                        </label>
                      </div>
                    </div>

                    <!-- LOGIN -->
                    <div class="col-12">
                      <div class="d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Log in</button>
                      </div>
                    </div>
                  </div>
                </form>

                <!-- LOADING SPINNER -->
                <LoadingSpinner v-if="loading" />

                <!-- INCORRECT PASSWORD ALERT -->
                <WarningAlert v-if="incorrect_login_message" :message="this.incorrect_login_message" />

                <!-- FORGOT PASSWORD -->
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end mt-4">
                      <a href="/password_reset">Forgot password</a>
                    </div>
                  </div>
                </div>

                <!-- CONTINUE WITH ALTERNATIVES -->
                <div class="row">
                  <div class="col-12">
                    <p class="mt-4 mb-4">Or continue with</p>
                    <div class="d-flex gap-2 gap-sm-3 justify-content-centerX">
                      <a href="#!" class="btn btn-outline-danger bsb-btn-circle bsb-btn-circle-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                          class="bi bi-google" viewBox="0 0 16 16">
                          <path
                            d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                      </a>
                      <a href="#!" class="btn btn-outline-primary bsb-btn-circle bsb-btn-circle-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                          class="bi bi-facebook" viewBox="0 0 16 16">
                          <path
                            d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                      </a>
                      <a href="#!" class="btn btn-outline-dark bsb-btn-circle bsb-btn-circle-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                          class="bi bi-apple" viewBox="0 0 16 16">
                          <path
                            d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                          <path
                            d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
