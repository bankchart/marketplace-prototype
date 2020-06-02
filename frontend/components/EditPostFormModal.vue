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
              รูปภาพ({{ post.pictures.length }}/10)
            </label>
          </div>
          <div class="control" style="margin-bottom: 25px">
            <picture-input
              v-if="pictureInputTriggerReset && post.pictures.length < 10"
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
          </div>
          <div class="columns is-multiline">
            <div
              v-for="(image, picIndex) in post.pictures"
              :key="`image-${picIndex}`"
              class="column is-one-quarter-desktop is-half-tablet"
            >
              <div class="card">
                <div class="card-image">
                  <figure class="image is-3by2">
                    <img
                      :src="
                        image.file
                          ? image.base64
                          : `${$axios.defaults.baseURL}${image.url}`
                      "
                      alt=""
                    />
                  </figure>
                  <div class="card-content is-overlay is-clipped">
                    <span
                      class="tag is-danger"
                      style="cursor: pointer"
                      @click="onRemove(image.id, picIndex)"
                    >
                      ลบ
                    </span>
                  </div>
                </div>
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
import PictureInput from "vue-picture-input";

export default {
  components: {
    PictureInput
  },

  data() {
    return {
      pictureInputTriggerReset: true,
      error: null,
      selectedForRemove: [],
      post: {
        id: null,
        title: null,
        detail: null,
        price: 0,
        pictures: [],
        keywords: "product"
      },
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: []
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
      detail: this.propsEditPostModal.postDetail,
      price: this.propsEditPostModal.postPrice,
      pictures: [...new Set([...this.propsEditPostModal.postPictures])]
    });
  },

  methods: {
    ...mapMutations({
      setShowEditPostModal: "setShowEditPostModal",
      setForceLoadPost: "setForceLoadPost",
      resetPropsEditPost: "resetPropsEditPost"
    }),

    onChange(imageBase64) {
      if (imageBase64) {
        const reader = new FileReader();
        reader.onload = e => {
          this.post.pictures.push({
            file: this.$refs.pictureInput.file,
            base64: e.target.result
          });
        };

        reader.readAsDataURL(this.$refs.pictureInput.file);
      } else {
        console.warn("FileReader API not supported: use the <form>, Luke!");
      }
    },

    onRemove(id, index) {
      this.selectedForRemove.push({
        id: parseInt(id)
      });
      this.post.pictures.splice(index, 1);
      if (this.post.pictures.length <= 0) {
        this.clearImage();
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
      this.post.pictures = [];
      setTimeout(() => {
        this.pictureInputTriggerReset = true;
      }, 100);
    },

    async editPost(e) {
      try {
        e.preventDefault();
        const formData = new FormData();
        const newPictureUploaded = [];
        let newUploadFlag = false;
        for (const img of this.selectedForRemove) {
          if (img.id) {
            await this.$backend.delete(`/upload/files/${img.id}`, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${this.jwtToken}`
              }
            });
          }
        }

        const tmpOld = [];

        for (const img of this.post.pictures) {
          if (img.id) {
            tmpOld.push(img.id);
          }

          if (img.file) {
            newUploadFlag = true;
            formData.append("files", img.file);
          }
        }

        if (newUploadFlag) {
          const newUploadResult = await this.$backend.post(
            "/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );

          for (const img of newUploadResult.data) {
            newPictureUploaded.push(img.id);
          }
        }
        const tmpPut = [...new Set([...(tmpOld || []), ...newPictureUploaded])];

        const result = await this.$backend.put(
          `/posts/${this.post.id}`,
          {
            detail:
              (this.post.detail || "").trim() === "" ? null : this.post.detail,
            price: this.post.price || 0,
            pictures: tmpPut
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
        console.error(e);
      }
    },
    closeModal() {
      this.setShowEditPostModal(false);
      this.resetPropsEditPost();
    }
  }
};
</script>
