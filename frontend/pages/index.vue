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
              <img
                :src="`/strapi${grp.profile_picture.url}`"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="~assets/user.svg" alt="Placeholder image" />
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
                <time :datetime="grp.updated_at">{{ grp.created_at }}</time>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
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
      const regResult = await axios.post(
        "https://9bkfullstackd.com/strapi/register-api",
        {
          facebook_userid: this.$auth.user.id,
          email: this.$auth.user.email,
          name: this.$auth.user.name,
          picture_profile: this.$auth.user.picture.data.url
        }
      );

      this.addJwt(regResult.data.jwt);
      this.setUserId(regResult.data.userId);

      localStorage.setItem("jwt", regResult.data.jwt);
      localStorage.setItem("userId", regResult.data.userId);

      const groupResult = await axios.get(
        "https://9bkfullstackd.com/strapi/groups"
      );
      let indexBreak = 3;
      let subGroupRow = [];
      for (const i in groupResult.data) {
        indexBreak--;
        subGroupRow.push(groupResult.data[i]);
        if (indexBreak === 0) {
          indexBreak = 3;
          this.groups.push([...subGroupRow]);
          subGroupRow = [];
        } else if (parseInt(i) === groupResult.data.length - 1) {
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
    })
  }
};
</script>
