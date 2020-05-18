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
              <textarea
                v-model="post.detail"
                class="textarea"
                rows="3"
                style="resize: none"
              ></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">คีย์เวิร์ด</label>
            <div class="contorl">
              <div class="select">
                <select v-model="post.keywords">
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
      jwtToken: "jwtToken"
    })
  },

  methods: {
    ...mapMutations({
      setShowCreatePostModal: "setShowCreatePostModal"
    }),

    async createPost(e) {
      try {
        const result = await axios.post(
          "https://localhost/posts",
          {
            title: this.post.title,
            detail: this.post.detail,
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
        e.preventDefault();
        window.location.reload();
      } catch (e) {
        this.error = e.message;
      }
    }
  }
};
</script>
