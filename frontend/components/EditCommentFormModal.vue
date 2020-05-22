<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">แก้ไขความคิดเห็น</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">ความคิดเห็น</label>
            <div class="control">
              <client-only>
                <quill-editor
                  v-model="comment.content"
                  :options="editorOption"
                />
              </client-only>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="editComment">แก้ไข</button>
        <button class="button" @click="closeModal()">
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
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      error: null,
      comment: {
        id: null,
        content: null
      },
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "image"]
          ]
        }
      }
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken",
      propsEditCommentModal: "propsEditCommentModal"
    })
  },

  mounted() {
    Object.assign(this.comment, {
      id: this.propsEditCommentModal.commentId,
      content: this.propsEditCommentModal.commentContent
    });
  },

  methods: {
    ...mapMutations({
      setShowEditCommentModal: "setShowEditCommentModal",
      setForceLoadPost: "setForceLoadPost",
      resetPropsEditComment: "resetPropsEditComment"
    }),

    async editComment(e) {
      try {
        e.preventDefault();
        const result = await this.$backend.put(
          `/comments/${this.comment.id}`,
          {
            content:
              (this.comment.content || "").trim() === ""
                ? null
                : this.comment.content
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.resetPropsEditComment();
        this.setShowEditCommentModal(false);
        this.setForceLoadPost(true);
      } catch (e) {
        this.error = e.message;
      }
    },
    closeModal() {
      this.setShowEditCommentModal(false);
      this.resetPropsEditComment();
    }
  }
};
</script>
