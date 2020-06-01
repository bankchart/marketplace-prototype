<template>
  <section class="section">
    <picture-input
      v-if="test"
      ref="pictureInput"
      width="350"
      height="350"
      margin="16"
      accept="image/*"
      size="5"
      :crop="false"
      :removable="false"
      :hide-change-button="true"
      :custom-strings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'เพิ่มรูปภาพ',
        remove: 'ลบรูปนี้',
        change: 'เปลี่ยนรูป'
      }"
      @prefill="onPrefill"
      @change="onChange"
      @remove="onRemove"
    >
    </picture-input>
    <button style="margin-bottom: 30px" @click="clearImage">
      ลบรูปทั้งหมด
    </button>
    <div class="columns is-multiline">
      <div
        v-for="(image, index) in images"
        :key="`image-${index}`"
        class="column is-one-quarter-desktop is-half-tablet"
      >
        <div v-if="image" class="card">
          <div class="card-image">
            <figure class="image is-3by2">
              <img :src="image.base64" alt="" />
            </figure>
            <!-- <div class="card-content is-overlay is-clipped">
              <span
                class="tag is-danger"
                style="cursor: pointer"
                @click="onRemove(index)"
              >
                ลบ
              </span>
            </div> -->
          </div>
          <!-- <footer class="card-footer">
            <a class="card-footer-item">
              BUY
            </a>
          </footer> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import PictureInput from "vue-picture-input";

export default {
  components: {
    PictureInput
  },

  data() {
    return {
      test: true,
      images: [],
      currImageIndex: -1
    };
  },

  mounted() {},

  computed: {
    ...mapGetters({
      jwtToken: "jwtToken"
    })
  },

  methods: {
    onChange(imageBase64) {
      if (imageBase64) {
        const formData = new FormData();
        // formData.append("files", this.$refs.pictureInput.file);
        const reader = new FileReader();
        reader.onload = e => {
          this.images.push({
            file: this.$refs.pictureInput.file,
            base64: e.target.result
          });
          this.clearPreviewImage();
        };

        reader.readAsDataURL(this.$refs.pictureInput.file);
        // try {
        //   const result = await this.$backend.post("/upload", formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       Authorization: `Bearer ${this.jwtToken}`
        //     }
        //   });
        //   console.log(result);
        // } catch (e) {
        //   console.error(e);
        // }
        // for (const pair of formData.entries()) {
        //   console.log(pair);
        // }
        console.log("Picture loaded.");
        // this.image = image;
      } else {
        console.log("FileReader API not supported: use the <form>, Luke!");
      }
    },
    clearPreviewImage() {
      this.test = false;
      setTimeout(() => {
        this.test = true;
      }, 100);
    },
    clearImage() {
      this.test = false;
      this.images = [];
      setTimeout(() => {
        this.test = true;
      }, 100);
    },
    onRemove(index) {
      if (index) {
        this.images[index] = null;
      } else {
        this.images[this.currImageIndex] = null;
      }
      if (this.currImageIndex > 0) {
        this.currImageIndex--;
      }
    }
  }
};
</script>
