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
            <label class="label">แท็ก</label>
            <div class="contorl">
              <vue-tags-input
                v-model="tag"
                placeholder=""
                :tags="tags"
                :autocomplete-items="filteredItems"
                @tags-changed="newTags => (tags = newTags)"
                @before-adding-tag="checkDupTag"
              />
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
          toolbar: [["image"]]
        },
        placeholder: ""
      },
      tag: "",
      tags: [],
      autocompleteItems: []
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken"
    }),
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().includes(this.tag.toLowerCase());
      });
    }
  },

  async mounted() {
    this.autocompleteItems = await this.loadTags();
  },

  methods: {
    ...mapMutations({
      setShowCreatePostModal: "setShowCreatePostModal",
      setForceLoadPost: "setForceLoadPost"
    }),

    async createPost(e) {
      try {
        e.preventDefault();
        const postTags = [];
        for (const tag of this.tags) {
          postTags.push(parseInt(tag.id));
        }

        const tempAutocompleteItems = [];
        const tempTags = [];

        this.autocompleteItems.forEach(tag => {
          tempAutocompleteItems.push(tag.text);
        });

        this.tags.forEach(tag => {
          tempTags.push(tag.text);
        });

        const difference = tempTags.filter(
          tag => !tempAutocompleteItems.includes(tag)
        );

        let newTagsResult = {};

        if (difference.length > 0) {
          newTagsResult = await this.$backend.post(
            "/tags-api",
            {
              tags: difference
            },
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );
        } else {
          newTagsResult = {
            data: { tags: [] }
          };
        }

        const result = await this.$backend.post(
          "/posts",
          {
            title: this.post.title,
            detail:
              (this.post.detail || "").trim() === "" ? null : this.post.detail,
            keywords: this.post.keywords,
            group: this.$route.params.id,
            owner: this.userId,
            categories: [...new Set([...postTags, ...newTagsResult.data.tags])]
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
    },

    async loadTags() {
      const result = await this.$backend.post(
        "/graphql",
        {
          query: `
            query {
              categories {
                id
                text: name
              }
            }
          `
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        }
      );
      return result.data.data.categories;
    },

    checkDupTag(obj) {
      let add = true;
      for (const tag of this.tags) {
        if (obj.tag.text.toLowerCase().trim() === tag.text.toLowerCase()) {
          this.tag = "";
          add = false;
          break;
        }
      }
      if (add) {
        obj.addTag();
      }
    }
  }
};
</script>

<style lang="css" scoped>
.vue-tags-input {
  max-width: none !important;
}
.input {
  border-radius: 0px;
  box-shadow: none;
}
</style>
