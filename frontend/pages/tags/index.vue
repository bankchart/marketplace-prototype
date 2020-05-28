<template>
  <section class="section">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="$router.push('/')">
            <span class="icon is-small">
              <fa :icon="['fas', 'home']" />
            </span>
            <span>Marketplace</span>
          </a>
        </li>
        <li class="is-active">
          <a href="#">
            <span class="icon is-small">
              <fa :icon="['fas', 'tags']" />
            </span>
            <span>แท็กทั้งหมด</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="content-detail">
      <div class="tags">
        <span
          v-for="(tag, tagIndex) in tags"
          :key="tagIndex"
          class="tag"
          @click="$router.push(`/tags/${tag.name}`)"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tags: []
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken"
    })
  },

  async mounted() {
    const result = await this.$backend.post(
      "/graphql",
      {
        query: `
        query {
          tags: categories {
            id
            name
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
    this.tags = result.data.data.tags;
  }
};
</script>

<style scoped>
.content-detail {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px solid #eeeeee;
  position: relative;
}
.tag {
  background-color: #eaeaea;
}
.tag:hover {
  cursor: pointer;
  background-color: #f5f5f5;
}
</style>
