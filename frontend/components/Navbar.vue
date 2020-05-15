<template>
  <nav class="navbar is-light">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">Marketplace</nuxt-link>
        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div
            v-if="isAuthenticated"
            class="navbar-item has-dropdown is-hoverable"
          >
            <div class="media">
              <img
                class="mr-3"
                :src="loggedInUser.picture.data.url"
                alt="Profile image"
                style="margin-top: 12px; border-radius: 50%"
              />
            </div>
            <a class="navbar-link">
              {{ loggedInUser.username }}
            </a>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" to="/profile"
                >My Profile</nuxt-link
              >
              <hr class="navbar-divider" />
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    }
  }
};
</script>
