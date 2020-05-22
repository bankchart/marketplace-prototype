<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item" to="/">Marketplace</nuxt-link>
      <a
        v-if="isAuthenticated"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        @click="openBurgerMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div v-if="isAuthenticated" ref="marketplace-menu" class="navbar-menu">
      <div class="navbar-start">
        <nuxt-link class="navbar-item" to="/profile">My Profile</nuxt-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-outlined" @click="logout">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      toggleBurgerMenu: false
    };
  },

  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },

  methods: {
    openBurgerMenu() {
      this.toggleBurgerMenu = !this.toggleBurgerMenu;
      this.$nextTick(() => {
        this.$refs["marketplace-menu"].classList.remove("is-active");
        if (this.toggleBurgerMenu) {
          this.$refs["marketplace-menu"].classList.add("is-active");
        } else {
          this.$refs["marketplace-menu"].classList.remove("is-active");
        }
      });
    },
    async logout() {
      await this.$auth.logout();
      this.$router.push("/login");
    }
  }
};
</script>
