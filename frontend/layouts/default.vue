<template>
  <div>
    <Navbar />
    <nuxt />
    <CreateGroupFormModal v-if="showCreateGroupModal" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "~/components/Navbar";
import CreateGroupFormModal from "~/components/CreateGroupFormModal";

export default {
  components: {
    Navbar,
    CreateGroupFormModal
  },

  computed: {
    ...mapGetters({
      showCreateGroupModal: "isShowCreateGroupModal"
    })
  },

  mounted() {
    console.log(this.$store);
  }
};
</script>
