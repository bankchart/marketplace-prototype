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
            <label class="label">ชื่อ</label>
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
                :autocomplete-min-length="0"
                @tags-changed="newTags => (tags = newTags)"
                @before-adding-tag="checkDupTag"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">ราคา</label>
            <div class="control">
              <currency-input
                v-model="post.price"
                currency="THB"
                :allow-negative="false"
                class="input"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">คำอธิบาย</label>
            <div class="control">
              <client-only>
                <quill-editor v-model="post.detail" :options="editorOption" />
              </client-only>
            </div>
          </div>

          <div class="field">
            <label class="label">
              รูปภาพ({{ images.length }}/10)
              <span
                v-if="images.length > 0"
                class="tag is-danger"
                style="cursor: pointer"
                @click="clearImage"
              >
                ลบรูปทั้งหมด
              </span>
            </label>
            <div class="control">
              <picture-input
                v-if="pictureInputTriggerReset && images.length < 10"
                ref="pictureInput"
                width="250"
                height="250"
                margin="16"
                accept="image/*"
                size="5"
                :crop="false"
                :removable="false"
                :hide-change-button="false"
                :custom-strings="{
                  upload: '<h1>Bummer!</h1>',
                  drag: 'เพิ่มรูปภาพ',
                  remove: 'ลบรูปนี้',
                  change: 'เพิ่มรูปภาพ'
                }"
                @change="onChange"
              >
              </picture-input>
              <div class="columns is-multiline">
                <div
                  v-for="(image, index) in images"
                  :key="`image-${index}`"
                  class="column is-one-quarter-desktop is-half-tablet"
                >
                  <div class="card">
                    <div class="card-image">
                      <figure class="image is-3by2">
                        <img :src="image.base64" alt="" />
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="field">
            <label class="label">คีย์เวิร์ด</label>
            <div class="contorl">
              <div class="select">
                <select v-model="post.keywords" disabled>
                  <option value="product">สินค้า</option>
                  <option value="service">บริการ</option>
                </select>
              </div>
            </div>
          </div> -->
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
import PictureInput from "vue-picture-input";

export default {
  components: {
    PictureInput
  },

  data() {
    return {
      pictureInputTriggerReset: true,
      error: null,
      post: {
        title: null,
        detail: null,
        price: 0,
        keywords: "product"
      },
      editorOption: {
        theme: "bubble",
        modules: {
          toolbar: []
        },
        placeholder: ""
      },
      tag: "",
      tags: [],
      autocompleteItems: [],
      images: []
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

    onChange(imageBase64) {
      if (imageBase64) {
        const reader = new FileReader();
        reader.onload = e => {
          this.images.push({
            file: this.$refs.pictureInput.file,
            base64: e.target.result
          });
        };

        reader.readAsDataURL(this.$refs.pictureInput.file);
      } else {
        console.warn("FileReader API not supported: use the <form>, Luke!");
      }
    },

    clearPreviewImage() {
      this.pictureInputTriggerReset = false;
      setTimeout(() => {
        this.pictureInputTriggerReset = true;
      }, 100);
    },

    clearImage() {
      this.pictureInputTriggerReset = false;
      this.images = [];
      setTimeout(() => {
        this.pictureInputTriggerReset = true;
      }, 100);
    },

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
        const uploads = [];

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

        if (this.images.length > 0) {
          const formData = new FormData();
          this.images.forEach(img => {
            formData.append("files", img.file);
          });

          const result = await this.$backend.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.jwtToken}`
            }
          });

          result.data.forEach(img => {
            uploads.push(img.id);
          });
        }

        const result = await this.$backend.post(
          "/posts",
          {
            title: this.post.title,
            price: this.post.price,
            detail:
              (this.post.detail || "").trim() === "" ? null : this.post.detail,
            keywords: this.post.keywords,
            group: this.$route.params.id,
            owner: this.userId,
            categories: [...new Set([...postTags, ...newTagsResult.data.tags])],
            pictures: uploads
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
        if (obj.tag.text.trim() === tag.text) {
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
.quill-editor {
  border: 1px solid #cccccc;
}
.input {
  border-radius: 0px;
  box-shadow: none;
}
</style>
