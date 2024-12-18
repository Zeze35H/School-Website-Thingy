<script>
import WarningAlert from "@/components/WarningAlert.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import SideText from "@/components/SideText.vue";

import UserDataService from "../services/UserDataService.js";

export default {
  name: 'register-view',
  components: {
    WarningAlert, LoadingSpinner, SideText
  },
  data() {
    return {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "Student",
      token: "",

      error_message: "",

      loading: false
    };
  },
  methods: {
    selectRole(role) {
      this.role = role
    },
    registerUser() {

      this.error_message = ""

      this.loading = true

      if (this.password !== this.confirm_password) {
        this.error_message = "The inserted passwords do not match."
        this.loading = false
        return
      }

      UserDataService.findByUsername(this.username)
        .then(response => {
          if (response.data.length != 0) {
            this.error_message = "The inserted username is already in use."
            this.loading = false
            return
          }
          else {

            UserDataService.findByEmail(this.email)
              .then(response => {
                if (response.data.length != 0) {
                  this.error_message = "The inserted email is already in use."
                  this.loading = false
                  return
                }
                else {
                  const userData = {
                    name: this.name,
                    surname: this.surname,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    role: this.role === "Professor" ? 2 : 1,
                    token: this.role === "Professor" ? this.token : null,
                  };

                  // Call the service to save user
                  UserDataService.create(userData)
                    .then(response => {
                      // Handle successful registration
                      console.log("User registered:", response);
                      this.$router.push({ name: 'confirm_email', query: {} });
                    })
                    .catch(err => {
                      // Handle errors
                      console.log(err.response)
                      this.error_message = err.response.data.message || err.message
                      this.loading = false
                    });
                }
              })
          }
        })
        .catch(err => {
          this.error_message = err.message
          this.loading = false
          return
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    // Add a delay before the route change is allowed
    setTimeout(() => {
      next(); // Continue the route transition after a delay
    }, 1000); // 1-second delay
  }
};

</script>

<template>
  <!-- Login 9 - Bootstrap Brain Component -->
  <section class="gradient-custom-1 p-3 py-md-5 py-xl-8">
    <div class="container">
      <div class="row gy-4 align-items-center">
        <div class="col-12 col-md-6 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-3 p-md-4 p-xl-5">
              <h3>Register</h3>
              <p>Already have an account? <a href="/">Log in</a></p>

              <form class="register-form" @submit.prevent="registerUser">
                <div class="row gy-3">

                  <!-- Name -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="name" type="text" class="form-control" name="name" placeholder="Name" required>
                      <label for="name" class="form-label">Name</label>
                    </div>
                  </div>

                  <!-- Surname -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="surname" type="text" class="form-control" name="surname" placeholder="Surname"
                        required>
                      <label for="surname" class="form-label">Surname</label>
                    </div>
                  </div>

                  <!-- Username -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="username" type="text" class="form-control" name="username" placeholder="Username"
                        required>
                      <label for="username" class="form-label">Username</label>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="email" type="email" class="form-control" name="email" placeholder="E-mail"
                        required>
                      <label for="email" class="form-label">Email</label>
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="password" type="password" class="form-control" name="password"
                        placeholder="Password" required>
                      <label for="password" class="form-label">Password</label>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="confirm_password" type="password" class="form-control" name="confirm_password"
                        placeholder="Confirm Password" required>
                      <label for="confirm_password" class="form-label">Confirm Password</label>
                    </div>
                  </div>


                  <!-- Role Selection -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <div class="btn-group dropend">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false">
                          Select a Role
                        </button>
                        <ul class="dropdown-menu">
                          <li><a @click="selectRole('Student')" class="dropdown-item" href="#role">Student</a></li>
                          <li><a @click="selectRole('Professor')" class="dropdown-item" href="#role">Professor</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <!-- Role Display -->
                    <div id="role" class="row">
                      <div class="col">
                        <div class="form-floating mb-1">
                          <input v-model="role" type="text" class="form-control" name="role" placeholder="Role" required
                            tabindex="-1" disabled>
                          <label for="role" class="form-label">Role</label>
                        </div>
                      </div>

                      <!-- Token for Professors -->
                      <div v-if="role === 'Professor'" class="col">
                        <div class="form-floating mb-1">
                          <input v-model="token" type="text" class="form-control" name="token" placeholder="Token"
                            required>
                          <label for="token" class="form-label">Token</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Register Button -->
                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" type="submit">Register</button>
                    </div>
                  </div>

                  <!-- ERROR WARNINGS -->
                  <div class="col-12">
                    <WarningAlert v-if="error_message" :message="error_message" />
                  </div>

                </div>
              </form>

              <!-- LOADING SPINNER -->
              <LoadingSpinner v-if="loading" />

            </div>
          </div>
        </div>

        <!-- SIDE TEXT -->
        <div class="col-12 col-md-6 col-xl-7">
          <SideText/>
        </div>
      </div>
    </div>
  </section>
</template>
