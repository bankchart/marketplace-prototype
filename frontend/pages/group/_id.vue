<template>
  <section class="section">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="$router.push('/')">
            <span class="icon is-small">
              <fa :icon="['fas', 'home']" />
              <i class="fas fa-home"></i>
            </span>
            <span>Marketplace</span>
          </a>
        </li>
        <li class="is-active">
          <a href="#">
            <span class="icon is-small">
              <fa :icon="['fas', 'users']" />
            </span>
            <span>{{ groupName }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <button
      class="button is-primary is-large"
      style="margin-bottom: 15px"
      @click="setShowCreatePostModal(true)"
    >
      สร้างโพสต์
    </button>
    <div class="field has-addons has-addons">
      <p class="control">
        <span class="select">
          <select v-model="search.filterBy">
            <option value="postName">ชื่อโพสต์</option>
            <option value="postOwner">เจ้าของโพสต์</option>
          </select>
        </span>
      </p>
      <p class="control">
        <input v-model="search.value" class="input" type="text" />
      </p>
      <p class="control">
        <a class="button is-primary" @click="onSearch">ค้นหา</a>
      </p>
    </div>

    <template v-if="ready && posts.length > 0">
      <div
        v-for="(post, index) in posts"
        :key="`post-${index}`"
        style="border: 1px solid rgba(232, 230, 227, 1); margin-bottom: 15px; padding: 15px; background-color: #F5F5F5;"
      >
        <article class="media">
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
                {{ post.detail }}
                <br />
              </p>
            </div>

            <article
              v-for="(comment, commentIndex) in post.comments"
              :key="`comment-${commentIndex}`"
              class="media"
            >
              <figure class="media-left">
                <p class="image is-48x48">
                  <img :src="comment.picture_profile" />
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <small
                      style="border-bottom: 1px solid #cccccc69; padding-bottom: 5px"
                    >
                      {{ comment.owner_name }}
                    </small>
                    <br />
                    {{ comment.content }}
                    <br />
                  </p>
                </div>
              </div>
            </article>
          </div>
        </article>
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="$auth.user.picture.data.url" />
            </p>
          </figure>
          <div class="media-content">
            <div class="field">
              <p class="control">
                <textarea
                  :ref="`comment_${post.id}`"
                  class="textarea"
                  rows="3"
                  style="resize: none"
                  placeholder="แสดงความคิดเห็น"
                ></textarea>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <button
                  :ref="`button_${post.id}`"
                  class="button is-primary"
                  :disabled="savingComment"
                  @click="createComment(post.id)"
                >
                  บันทึก
                </button>
              </p>
            </div>
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
import axios from "axios";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      groupName: null,
      search: {
        filterBy: "postName",
        value: null
      },
      savingComment: false,
      ready: false,
      posts: []
    };
  },

  async mounted() {
    await this.loadPosts();
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken"
    })
  },

  methods: {
    async loadPosts() {
      try {
        this.ready = false;
        const result = await axios.get(
          `https://localhost/groups/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        this.groupName = result.data.name;
        this.posts = result.data.posts || [];
        for (const post in this.posts) {
          const postIndex = parseInt(post);
          const postTmp = await this.getPostById(this.posts[postIndex].id);
          Object.assign(this.posts[postIndex], postTmp);
          for (const comment in this.posts[postIndex].comments) {
            const commentIndex = parseInt(comment);
            const user = await this.getUserById(
              this.posts[postIndex].comments[commentIndex].owner
            );
            this.posts[postIndex].comments[commentIndex].picture_profile =
              user.picture_profile;
            this.posts[postIndex].comments[commentIndex].owner_name =
              user.first_name + " " + user.last_name;
          }
        }
        this.ready = true;
        console.log(this.posts);
      } catch (e) {
        console.error(e);
      }
    },
    async createComment(postId) {
      await this.$nextTick(async () => {
        try {
          this.savingComment = true;
          const postComment = this.$refs[`comment_${postId}`][0].value.trim();
          this.$refs[`button_${postId}`][0].classList.remove("is-loading");
          this.$refs[`button_${postId}`][0].classList.add("is-loading");

          // const test = new Promise(resolve => {
          //   setTimeout(() => {
          //     resolve();
          //   }, 1000);
          // });

          // await test;

          const result = await axios.post(
            "https://localhost/comments",
            {
              content: postComment,
              post: postId,
              owner: this.userId
            },
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );

          this.savingComment = false;
          this.$refs[`button_${postId}`][0].classList.remove("is-loading");
          this.$refs[`comment_${postId}`][0].value = "";
          await this.loadPosts();
        } catch (e) {
          console.error(e);
          this.savingComment = false;
          this.$refs[`button_${postId}`][0].classList.remove("is-loading");
        }
      });
    },
    async getPostById(id) {
      try {
        const result = await axios.get(`https://localhost/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        });
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    async getUserById(id) {
      try {
        const result = await axios.get(`https://localhost/users/${id}`);
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    onSearch() {
      console.log(this.search);
    },
    ...mapMutations({
      setShowCreatePostModal: "setShowCreatePostModal"
    })
  }
};
</script>

<style scoped></style>
