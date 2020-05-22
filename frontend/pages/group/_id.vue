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
          <select v-model="search.filterBy" disabled>
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
            <template v-if="parseInt(userId) === post.owner.id">
              <button
                class="delete is-pulled-right"
                aria-label="close"
                @click="
                  triggerOpenConfirmDeleteModal(
                    post.id,
                    post.title,
                    $route.params.id
                  )
                "
              ></button>
              <span
                class="icon is-pulled-right edit-icon"
                style="cursor: pointer;"
                @click="
                  triggerOpenEditPostModal(
                    post.id,
                    post.title,
                    post.detail,
                    $route.params.id
                  )
                "
              >
                <fa :icon="['fas', 'edit']" />
              </span>
            </template>
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
                <template v-if="parseInt(userId) === comment.owner">
                  <button
                    class="delete is-pulled-right"
                    aria-label="close"
                    @click="
                      triggerOpenConfirmDeleteCommentModal(
                        comment.id,
                        comment.content
                      )
                    "
                  ></button>
                  <span
                    class="icon is-pulled-right edit-icon"
                    style="cursor: pointer;"
                    @click="
                      triggerOpenEditCommentModal(comment.id, comment.content)
                    "
                  >
                    <fa :icon="['fas', 'edit']" />
                  </span>
                </template>
                <div class="content">
                  <p>
                    <small
                      style="border-bottom: 1px solid #cccccc69; padding-bottom: 5px"
                    >
                      {{ comment.owner_name }}
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
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      groupName: null,
      search: {
        filterBy: "postName",
        value: ""
      },
      savingComment: false,
      ready: false,
      posts: []
    };
  },

  computed: {
    ...mapGetters({
      userId: "userId",
      jwtToken: "jwtToken"
    }),
    ...mapState(["forceLoadPost"])
  },

  watch: {
    async forceLoadPost(newValue, oldValue) {
      if (newValue) {
        await this.loadPosts();
        this.setForceLoadPost(false);
      }
    }
  },

  async mounted() {
    await this.loadPosts();
  },

  methods: {
    triggerOpenConfirmDeleteModal(postId, postName, groupId) {
      this.setPropsConfirmDeletePost({ postId, postName, groupId });
      this.setShowConfirmDeletePostModal(true);
    },
    triggerOpenEditPostModal(postId, postName, postDetail, groupId) {
      this.setPropsEditPost({ postId, postName, postDetail, groupId });
      this.setShowEditPostModal(true);
    },
    triggerOpenConfirmDeleteCommentModal(commentId, commentContent) {
      this.setPropsConfirmDeleteComment({ commentId, commentContent });
      this.setShowConfirmDeleteCommentModal(true);
    },
    triggerOpenEditCommentModal(commentId, commentContent) {
      this.setPropsEditComment({ commentId, commentContent });
      this.setShowEditCommentModal(true);
    },
    async loadPosts(fromSearch = null) {
      try {
        this.ready = false;
        if (!fromSearch) {
          const result = await axios.get(
            `https://9bkfullstackd.com/strapi/groups/${this.$route.params.id}`,
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );
          this.groupName = result.data.name;
          this.posts = result.data.posts || [];
        } else {
          this.posts = fromSearch;
        }
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
      } catch (e) {
        console.error(e);
      }
    },
    async createComment(postId) {
      await this.$nextTick(async () => {
        try {
          const postComment = this.$refs[`comment_${postId}`][0].value.trim();
          if (postComment.length > 0) {
            this.savingComment = true;
            this.$refs[`button_${postId}`][0].classList.remove("is-loading");
            this.$refs[`button_${postId}`][0].classList.add("is-loading");

            const result = await axios.post(
              "https://9bkfullstackd.com/strapi/comments",
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
          }
        } catch (e) {
          console.error(e);
          this.savingComment = false;
          this.$refs[`button_${postId}`][0].classList.remove("is-loading");
        }
      });
    },
    async getPostById(id) {
      try {
        const result = await axios.get(
          `https://9bkfullstackd.com/strapi/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${this.jwtToken}`
            }
          }
        );
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    async getUserById(id) {
      try {
        const result = await axios.get(
          `https://9bkfullstackd.com/strapi/users/${id}`
        );
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    async onSearch() {
      try {
        if (this.search.value.trim().length > 0) {
          const result = await axios.get(
            `https://9bkfullstackd.com/strapi/posts`,
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              },
              params: {
                title_contains: this.search.value.trim(),
                group_eq: this.$route.params.id
              }
            }
          );
          this.loadPosts(result.data);
        } else {
          this.loadPosts();
        }
      } catch (e) {
        console.error(e);
      }
    },
    ...mapMutations({
      setShowCreatePostModal: "setShowCreatePostModal",
      setShowEditPostModal: "setShowEditPostModal",
      setShowEditCommentModal: "setShowEditCommentModal",
      setForceLoadPost: "setForceLoadPost",
      setShowConfirmDeletePostModal: "setShowConfirmDeletePostModal",
      setShowConfirmDeleteCommentModal: "setShowConfirmDeleteCommentModal",
      setPropsConfirmDeletePost: "setPropsConfirmDeletePost",
      setPropsConfirmDeleteComment: "setPropsConfirmDeleteComment",
      setPropsEditPost: "setPropsEditPost",
      setPropsEditComment: "setPropsEditComment",
      resetPropsConfirmDeletePost: "resetPropsConfirmDeletePost",
      resetPropsConfirmDeleteComment: "resetPropsConfirmDeleteComment"
    })
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
</style>
