<template>
  <div>
    <Navbar />
    <nuxt style="min-height: 70vh;" />
    <CreateGroupFormModal v-if="showCreateGroupModal" />
    <CreatePostFormModal v-if="showCreatePostModal" />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Marketplace</strong> by
          <a target="_blank" href="https://xp-link.com">XPLink Co.,Ltd</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "~/components/Navbar";
import CreateGroupFormModal from "~/components/CreateGroupFormModal";
import CreatePostFormModal from "~/components/CreatePostFormModal";

export default {
  components: {
    Navbar,
    CreateGroupFormModal,
    CreatePostFormModal
  },

  computed: {
    ...mapGetters({
      showCreateGroupModal: "isShowCreateGroupModal",
      showCreatePostModal: "isShowCreatePostModal"
    })
  },

  mounted() {
    console.log(this.$store);
  }
};
</script>
