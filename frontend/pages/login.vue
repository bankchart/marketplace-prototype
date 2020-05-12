<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome!</h2>

          <Notification v-if="error" :message="error" />

          <form method="post" @submit.prevent="login">
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Log In with Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  components: {
    Notification
  },

  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith("facebook");

        this.$router.push("/");
      } catch (e) {
        this.error = e.response.data.message;
      }
    }
  }
};
</script>
