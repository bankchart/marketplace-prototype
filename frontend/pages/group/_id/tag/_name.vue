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
        <li>
          <a href="#" @click="$router.push(parentPath)">
            <span class="icon is-small">
              <fa :icon="['fas', 'users']" />
            </span>
            <span>{{ groupName }}</span>
          </a>
        </li>
        <li class="is-active">
          <a href="#">
            <span class="icon is-small">
              <fa :icon="['fas', 'tags']" />
            </span>
            <span>แท็ก: {{ this.$route.params.name }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <template v-if="subReady && posts.length > 0">
      <div
        v-for="(post, index) in posts"
        :key="`post-${index}`"
        class="post-detail"
        @click="gotoPost(post.id)"
      >
        <article :id="post.id" class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="post.owner.picture_profile" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <small
                  style="border-bottom: 1px solid #cccccc69; padding-bottom: 5px"
                >
                  {{ post.owner.first_name }} {{ post.owner.last_name }}
                </small>
                <br />
                <small
                  ><strong>{{ post.title }}</strong></small
                >
                <br />
                <span v-html="post.detail"></span>
                <br />
              </p>
              <span
                v-for="(tag, tagIndex) in post.categories"
                :key="`tag-${tagIndex}`"
                class="tag is-info is-light custom-tag"
                style="margin-right: 5px"
                >{{ tag.name }}</span
              >
            </div>

            <article
              v-for="(comment, commentIndex) in post.comments"
              :key="`comment-${commentIndex}`"
              class="media"
            >
              <figure class="media-left">
                <p class="image is-48x48">
                  <img :src="comment.owner.picture_profile" />
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <small
                      style="border-bottom: 1px solid #cccccc69; padding-bottom: 5px"
                    >
                      {{ comment.owner.first_name }}
                      {{ comment.owner.last_name }}
                    </small>
                    <br />
                    <span v-html="comment.content"></span>
                    <br />
                  </p>
                </div>
              </div>
            </article>
          </div>
        </article>
      </div>
    </template>
    <template v-else>
      <h2 class="has-text-centered">ไม่พบโพสต์</h2>
    </template>
  </section>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      subReady: false,
      parentPath: "/",
      groupName: "",
      posts: [],
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [["image"]]
        }
      }
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken"
    }),
    ...mapState(["forceLoadPost"])
  },

  async mounted() {
    this.parentPath = `/group/${this.$route.params.id}`;
    await this.loadPosts();
  },

  methods: {
    async loadPosts() {
      try {
        this.subReady = false;
        const tag = this.$route.params.name;
        const groupId = this.$route.params.id;
        const result = await this.$backend.post(
          "/graphql",
          {
            query: `
            query {
              group(id: ${groupId}) {
                name
              }
              categories(where: { name: "${tag}" posts:{group:{id: ${groupId}}} }) {
                id
                name
                posts {
                  id
                  title
                  detail
                  owner {
                    id
                    first_name
                    last_name
                    picture_profile
                  }
                  comments {
                    id
                    content
                    owner {
                      id
                      first_name
                      last_name
                      picture_profile
                    }
                  }
                  categories {
                    name
                  }
                  group {
                    name
                  }
                }
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

        const categories = result.data.data.categories;
        this.groupName = result.data.data.group.name;
        if (categories.length > 0 && categories[0]) {
          this.posts = categories[0].posts;
        }
        this.subReady = true;
      } catch (e) {
        console.error(e);
      }
    },
    gotoPost(id) {
      this.$router.push(`/group/${this.$route.params.id}#${id}`);
    }
  }
};
</script>

<style scoped>
.edit-icon {
  margin-right: 20px;
  margin-top: -3px;
  font-size: 20px;
  color: #c9c9c9;
}
.content p {
  margin-bottom: 0px;
}
.post-detail {
  border: 1px solid rgba(232, 230, 227, 1);
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f5f5f5;
}
.post-detail:hover {
  cursor: pointer;
}
</style>
