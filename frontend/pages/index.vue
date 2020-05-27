<template>
  <section class="section">
    <button
      v-if="jwtToken"
      class="button is-primary is-large"
      style="margin-bottom: 15px"
      @click="setShowCreateGroupModal(true)"
    >
      สร้างกลุ่ม
    </button>
    <div
      v-for="(subGrp, index) in groups"
      :key="`subGrp-${index}`"
      class="columns"
    >
      <div
        v-for="(grp, subGrpIndex) in subGrp"
        :key="`grp-${subGrpIndex}`"
        class="column is-4"
      >
        <div
          class="card"
          style="cursor: pointer"
          @click="$router.push(`group/${grp.id}`)"
        >
          <div class="card-image">
            <figure class="image is-4by3">
              <img :src="getGroupImage(grp)" alt="Placeholder image" />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img :src="grp.owner.picture_profile" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ grp.name }}</p>
                <p class="subtitle is-6">
                  เจ้าของกลุ่ม
                  {{ grp.owner.first_name + " " + grp.owner.last_name }}
                </p>
              </div>
            </div>

            <div class="content">
              {{ grp.university }}, {{ grp.major }}, {{ grp.class }}
              <br />
              <i style="font-size: 13px">
                วันที่สร้างกลุ่ม:
                <time :datetime="grp.updated_at"
                  >{{
                    new Date(grp.created_at).toLocaleString("th-TH", {
                      timeZone: "Asia/Bangkok"
                    })
                  }}
                  น.</time
                >
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      groups: []
    };
  },

  computed: {
    ...mapGetters({
      jwtToken: "jwtToken",
      userId: "userId"
    })
  },

  async mounted() {
    try {
      const regResult = await this.$backend.post("/register-api", {
        facebook_userid: this.$auth.user.id,
        email: this.$auth.user.email,
        name: this.$auth.user.name,
        picture_profile: this.$auth.user.picture.data.url
      });

      this.addJwt(regResult.data.jwt);
      this.setUserId(regResult.data.userId);

      localStorage.setItem("jwt", regResult.data.jwt);
      localStorage.setItem("userId", regResult.data.userId);

      const groupResult = await this.$backend.post(
        "/graphql",
        {
          query: `
          query {
            groups {
              id
              name
              major
              class
              university
              profile_picture {
                url
              }
              owner {
                id
                first_name
                last_name
                picture_profile
              }
              created_at
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

      let indexBreak = 3;
      let subGroupRow = [];
      for (const i in groupResult.data.data.groups) {
        indexBreak--;
        subGroupRow.push(groupResult.data.data.groups[i]);
        if (indexBreak === 0) {
          indexBreak = 3;
          this.groups.push([...subGroupRow]);
          subGroupRow = [];
        } else if (parseInt(i) === groupResult.data.data.groups.length - 1) {
          this.groups.push([...subGroupRow]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    ...mapMutations({
      addJwt: "addJwt",
      setUserId: "setUserId",
      setShowCreateGroupModal: "setShowCreateGroupModal"
    }),
    getGroupImage(group) {
      let image = require("~/assets/social.png");
      if (group.profile_picture) {
        image = `${this.$axios.defaults.baseURL}${group.profile_picture.url}`;
      }
      return image;
    }
  }
};
</script>
