<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">สร้างกลุ่ม</p>
        <button
          class="delete"
          aria-label="close"
          @click="setShowCreateGroupModal(false)"
        ></button>
      </header>
      <section class="modal-card-body">
        <div>
          <div class="field">
            <label class="label">ชื่อกลุ่ม</label>
            <div class="control">
              <input v-model="group.name" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">มหาวิทยาลัย/สถานศึกษา/อื่นๆ</label>
            <div class="control">
              <input v-model="group.university" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">สาขา/สาย/อื่นๆ</label>
            <div class="control">
              <input v-model="group.major" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">รุ่น</label>
            <div class="control">
              <input v-model="group.class" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">รูปกลุ่ม</label>
            <div class="control">
              <input
                id="groupPicture"
                type="file"
                accept="image/*"
                @change="previewImage"
              />
              <div v-if="group.imageData.length > 0" class="image-preview">
                <img class="preview" :src="`${group.imageData}`" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="createGroup">สร้าง</button>
        <button class="button" @click="setShowCreateGroupModal(false)">
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
      group: {
        name: null,
        university: null,
        major: null,
        class: null,
        imageData: ""
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
      setShowCreateGroupModal: "setShowCreateGroupModal"
    }),

    async createGroup(e) {
      try {
        e.preventDefault();
        let imageId = null;
        const imageFile = document.querySelector("#groupPicture");
        if (imageFile.files[0]) {
          imageId = await this.uploadImage();
        } else {
          throw new Error("กรุณาใส่รูปกลุ่ม");
        }

        const result = await this.$backend.post(
          "/groups",
          {
            name: this.group.name,
            university: this.group.university,
            major: this.group.major,
            class: this.group.class,
            owner: this.userId,
            profile_picture: imageId
          },
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.setShowCreateGroupModal(false);
        window.location.reload();
      } catch (e) {
        this.error = e.message;
      }
    },

    previewImage(event) {
      const input = event.target;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
          this.group.imageData = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },

    async uploadImage() {
      const formData = new FormData();
      const imageFile = document.querySelector("#groupPicture");
      formData.append("files", imageFile.files[0]);
      const result = await this.$backend.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return result.data[0].id;
    }
  }
};
</script>

<style lang="css" scoped>
.preview {
  width: 250px;
  margin-top: 20px;
}
</style>
