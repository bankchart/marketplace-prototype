<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">สร้างโพสต์</p>
        <button
          class="delete"
          aria-label="close"
          @click="setShowCreatePostModal(false)"
        ></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">ชื่อโพสต์</label>
            <div class="control">
              <input v-model="post.title" class="input" type="text" />
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
        <button class="button is-success" @click="createPost">สร้าง</button>
        <button class="button" @click="setShowCreatePostModal(false)">
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
      jwtToken: "jwtToken"
    })
  },

  methods: {
    ...mapMutations({
      setShowCreatePostModal: "setShowCreatePostModal",
      setForceLoadPost: "setForceLoadPost"
    }),

    async createPost(e) {
      try {
        e.preventDefault();
        const result = await this.$backend.post(
          "/posts",
          {
            title: this.post.title,
            detail:
              (this.post.detail || "").trim() === "" ? null : this.post.detail,
            keywords: this.post.keywords,
            group: this.$route.params.id,
            owner: this.userId
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.setShowCreatePostModal(false);
        this.setForceLoadPost(true);
      } catch (e) {
        this.error = e.message;
      }
    }
  }
};
</script>
