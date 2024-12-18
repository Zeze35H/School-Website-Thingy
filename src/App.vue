<script setup>
import UserDataService from "./services/UserDataService.js";
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from "vue-router"; // Import useRouter
import http from "./http-common.js";

const router = useRouter(); // Get the router instance

let isAuthenticated = ref(false)
let user = ref(null)

const checkAuthStatus = async () => {
  try {
    const response = await http.get('/auth/checkAuth', { withCredentials: true })
    console.log("isAuthenticated:", response.data.authenticated)
    isAuthenticated.value = response.data.authenticated;
    if (response.data.user)
      user.value = response.data.user
    return response.data
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null
  }
};

onMounted(() => {
  checkAuthStatus();
});

const logout = () => {
  // Call the service to save user
  UserDataService.logout()
    .then(response => {
      // Handle successful registration
      console.log("User logout:", response);
      checkAuthStatus();
      router.push({ name: 'login', query: {} });
    })
    .catch(error => {
      // Handle errors
      console.error("Error logging out user:", error);
    });
}

const updatePicture = (new_picture) => {
  user.value.picture = new_picture
}

const route = useRoute();

// Conditionally add the updatePicture event listener only when the Profile component is active
const routerViewListeners = computed(() => {
  return route.name === 'profile'
    ? { updatePicture: () => updatePicture() }
    : {};
});

</script>

<template>

  <!-- ICONS FOR ALERTS IN EVERY VIEW -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </symbol>
    <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
      <path
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </symbol>
    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
      <path
        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </symbol>
  </svg>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">

      <a class="navbar-brand" href="/">School Website Thingy</a>

      <!-- FOR MOBILE VERSION -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <!-- HOMEPAGE -->
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/home_page">Homepage</a>
          </li>

          <!-- User List -->
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/user_list">User List</a>
          </li>


        </ul>

        <!-- LOGOUT -->
        <div class="d-flex">
          <a v-if="isAuthenticated" @click="logout" type="button" class="btn btn-outline-secondary me-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z">
              </path>
              <path fill-rule="evenodd"
                d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z">
              </path>
            </svg>
            Logout
          </a>

          <!-- PROFILE -->
          <a v-if="isAuthenticated" :href="`/profile/${user.username}`">
            <img :src="user.picture" alt="" style="width: 42px; height: 42px" class="rounded-circle" />
          </a>


          <a v-if="!isAuthenticated" class="nav-link active me-3" aria-current="page" href="/login">Login</a>
          <a v-if="!isAuthenticated" class="nav-link active" aria-current="page" href="/register">Register</a>

        </div>
      </div>
    </div>
  </nav>
  <router-view v-bind="routerViewListeners" :checkAuthStatus="checkAuthStatus" />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
