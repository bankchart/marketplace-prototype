<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ยืนยันการลบโพสต์</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div>
          คุณต้องการลบโพสต์
          <strong>"{{ propsConfirmDeletePostModal.postName }}"</strong>
          ใช่หรือไม่ ?
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-danger" @click="deletePost">
          ใช่, ลบเลย
        </button>
        <button class="button" @click="closeModal">
          ยกเลิก
        </button>
        <article v-if="error" class="message is-danger">
          <div class="message-body" style="padding: 5px; border: 0px;">
            {{ error }}
          </div>
        </article>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      error: null,
      post: {
        title: null,
        detail: null,
        keywords: "product"
      }
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken",
      propsConfirmDeletePostModal: "propsConfirmDeletePostModal"
    })
  },

  methods: {
    ...mapMutations({
      setShowConfirmDeletePostModal: "setShowConfirmDeletePostModal",
      resetPropsConfirmDeletePost: "resetPropsConfirmDeletePost",
      setForceLoadPost: "setForceLoadPost"
    }),

    async deletePost(e) {
      try {
        e.preventDefault();
        const postId = this.propsConfirmDeletePostModal.postId;
        // TODO: delete post by only owner post
        const result = await axios.delete(
          `https://9bkfullstackd.com/strapi/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.resetPropsConfirmDeletePost();
        this.setShowConfirmDeletePostModal(false);
        this.setForceLoadPost(true);
      } catch (e) {
        console.error(e);
        this.error = e.message;
      }
    },
    closeModal() {
      this.setShowConfirmDeletePostModal(false);
      this.resetPropsConfirmDeletePost();
    }
  }
};
</script>
