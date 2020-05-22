<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">ยืนยันการลบความคิดเห็น</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div>
          คุณต้องการลบความคิดเห็น
          <strong
            >"<span
              v-html="propsConfirmDeleteCommentModal.commentContent"
            ></span
            >"</strong
          >
          ใช่หรือไม่ ?
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-danger" @click="deleteComment">
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
      propsConfirmDeleteCommentModal: "propsConfirmDeleteCommentModal"
    })
  },

  methods: {
    ...mapMutations({
      setShowConfirmDeleteCommentModal: "setShowConfirmDeleteCommentModal",
      resetPropsConfirmDeleteComment: "resetPropsConfirmDeleteComment",
      setForceLoadPost: "setForceLoadPost"
    }),

    async deleteComment(e) {
      try {
        e.preventDefault();
        const commentId = this.propsConfirmDeleteCommentModal.commentId;
        // TODO: delete post by only owner post
        const result = await axios.delete(
          `https://9bkfullstackd.com/strapi/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.resetPropsConfirmDeleteComment();
        this.setShowConfirmDeleteCommentModal(false);
        this.setForceLoadPost(true);
      } catch (e) {
        console.error(e);
        this.error = e.message;
      }
    },
    closeModal() {
      this.setShowConfirmDeleteCommentModal(false);
      this.resetPropsConfirmDeleteComment();
    }
  }
};
</script>
