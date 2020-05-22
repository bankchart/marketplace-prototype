<template>
  <div>
    <Navbar />
    <nuxt style="min-height: 70vh;" />
    <CreateGroupFormModal v-if="showCreateGroupModal" />
    <CreatePostFormModal v-if="showCreatePostModal" />
    <EditPostFormModal v-if="showEditPostModal" />
    <ConfirmDeletePostModal v-if="showConfirmDeletePostModal" />
    <EditCommentFormModal v-if="showEditCommentModal" />
    <ConfirmDeleteCommentModal v-if="showConfirmDeleteCommentModal" />
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
import { mapGetters, mapMutations } from "vuex";
import Navbar from "~/components/Navbar";
import CreateGroupFormModal from "~/components/CreateGroupFormModal";
import CreatePostFormModal from "~/components/CreatePostFormModal";
import EditPostFormModal from "~/components/EditPostFormModal";
import EditCommentFormModal from "~/components/EditCommentFormModal";
import ConfirmDeletePostModal from "~/components/ConfirmDeletePostModal";
import ConfirmDeleteCommentModal from "~/components/ConfirmDeleteCommentModal";

export default {
  components: {
    Navbar,
    CreateGroupFormModal,
    CreatePostFormModal,
    EditPostFormModal,
    EditCommentFormModal,
    ConfirmDeletePostModal,
    ConfirmDeleteCommentModal
  },

  computed: {
    ...mapGetters({
      jwtToken: "jwtToken",
      showCreateGroupModal: "isShowCreateGroupModal",
      showCreatePostModal: "isShowCreatePostModal",
      showEditPostModal: "isShowEditPostModal",
      showEditCommentModal: "isShowEditCommentModal",
      showConfirmDeletePostModal: "isShowConfirmDeletePostModal",
      showConfirmDeleteCommentModal: "isShowConfirmDeleteCommentModal"
    })
  },

  mounted() {
    if (!this.jwtToken) {
      this.$router.push("/");
    }
  },

  methods: {
    ...mapMutations({
      addJwt: "addJwt",
      setUserId: "setUserId"
    })
  }
};
</script>
