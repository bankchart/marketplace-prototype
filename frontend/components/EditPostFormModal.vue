<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">แก้ไขโพสต์</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">ชื่อโพสต์</label>
            <div class="control">
              <input v-model="post.title" disabled class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">รายละเอียด</label>
            <div class="control">
              <client-only>
                <quill-editor v-model="post.detail" :options="editorOption" />
              </client-only>
            </div>
          </div>

          <div class="field">
            <label class="label">คีย์เวิร์ด</label>
            <div class="contorl">
              <div class="select">
                <select v-model="post.keywords" disabled>
                  <option value="product">สินค้า</option>
                  <option value="service">บริการ</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="editPost">แก้ไข</button>
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
      post: {
        id: null,
        title: null,
        detail: null,
        keywords: "product"
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
      propsEditPostModal: "propsEditPostModal"
    })
  },

  mounted() {
    Object.assign(this.post, {
      id: this.propsEditPostModal.postId,
      title: this.propsEditPostModal.postName,
      detail: this.propsEditPostModal.postDetail
    });
  },

  methods: {
    ...mapMutations({
      setShowEditPostModal: "setShowEditPostModal",
      setForceLoadPost: "setForceLoadPost",
      resetPropsEditPost: "resetPropsEditPost"
    }),

    async editPost(e) {
      try {
        e.preventDefault();
        const result = await this.$backend.put(
          `/posts/${this.post.id}`,
          {
            detail:
              (this.post.detail || "").trim() === "" ? null : this.post.detail
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.resetPropsEditPost();
        this.setShowEditPostModal(false);
        this.setForceLoadPost(true);
      } catch (e) {
        this.error = e.message;
      }
    },
    closeModal() {
      this.setShowEditPostModal(false);
      this.resetPropsEditPost();
    }
  }
};
</script>
