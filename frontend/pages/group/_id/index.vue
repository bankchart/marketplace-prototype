<template>
  <section id="app" class="section">
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
        class="post-detail"
      >
        <article :id="post.id" :ref="`post_${post.id}`" class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="post.owner.picture_profile" />
            </p>
          </figure>
          <div class="media-content">
            <template v-if="userId === post.owner.id">
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
              <em>฿{{ post.price || 0 }}</em>
              <div class="columns is-multiline">
                <div
                  v-for="(pic, picIndex) in post.pictures"
                  :key="`pic-${picIndex}`"
                  class="column is-one-quarter-desktop is-half-tablet"
                >
                  <div class="card">
                    <div class="card-image">
                      <figure class="image is-3by2">
                        <img
                          :src="`${$axios.defaults.baseURL}${pic.url}`"
                          alt=""
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
              <span
                v-for="(tag, tagIndex) in post.categories"
                :key="`tag-${tagIndex}`"
                class="tag is-info is-light custom-tag"
                style="margin-right: 5px"
                @click="
                  $router.push(`/group/${$route.params.id}/tag/${tag.name}`)
                "
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
                <template v-if="userId === comment.owner.id">
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
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="$auth.user.picture.data.url" />
            </p>
          </figure>
          <div class="media-content">
            <div class="field">
              <p class="control">
                <client-only>
                  <quill-editor
                    :ref="`comment_${post.id}`"
                    :options="editorOption"
                    style="background-color: #FFFFFF;"
                  />
                </client-only>
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

  watch: {
    async forceLoadPost(newValue, oldValue) {
      if (newValue) {
        await this.loadPosts();
        this.setForceLoadPost(false);
      }
    },
    ready(newValue, oldValue) {
      if (newValue) {
        this.$nextTick(() => {
          if (this.$route.hash) {
            const postId = this.$route.hash.substring(1);
            const offsetTop = this.$refs[`post_${postId}`][0].offsetTop;
            window.scrollTo(0, offsetTop);
          }
        });
      }
    }
  },

  async mounted() {
    await this.loadPosts();
    await this.changeURL();
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
          const query = `query ($id: ID!) {
              group (id: $id) {
                  id
                  name
                  posts {
                    id
                    title
                    detail
                    price
                    pictures {
                      url
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
                    owner {
                      id
                      first_name
                      last_name
                      picture_profile
                    }
                    categories {
                      id
                      name
                    }
                  }
              }
          }`;
          const result = await this.$backend.post(
            "/graphql",
            {
              query,
              variables: {
                id: this.$route.params.id
              }
            },
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );
          this.groupName = result.data.data.group.name;
          this.posts = result.data.data.group.posts;
        } else {
          this.posts = fromSearch;
        }
        this.ready = true;
      } catch (e) {
        console.error(e);
      }
    },
    async createComment(postId) {
      await this.$nextTick(async () => {
        try {
          const postComment = (
            this.$refs[`comment_${postId}`][0]._content || ""
          ).trim();
          if (postComment.length > 0) {
            this.savingComment = true;
            this.$refs[`button_${postId}`][0].classList.remove("is-loading");
            this.$refs[`button_${postId}`][0].classList.add("is-loading");

            const result = await this.$backend.post(
              "/comments",
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
    async onSearch() {
      try {
        if (this.search.value.trim().length > 0) {
          const result = await this.$backend.post(
            "/graphql",
            {
              query: `
              query ($title: String!){
                posts (where: { title_contains: $title }) {
                  id
                  title
                  detail
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
                  owner {
                    id
                    first_name
                    last_name
                    picture_profile
                  }
                  categories {
                    id
                    name
                  }
                }
              }
              `,
              variables: {
                title: this.search.value.trim()
              }
            },
            {
              headers: {
                Authorization: `Bearer ${this.jwtToken}`
              }
            }
          );
          this.loadPosts(result.data.data.posts);
        } else {
          this.loadPosts();
        }
      } catch (e) {
        console.error(e);
      }
    },
    changeURL() {
      let postName = "";
      let newUrl = "";
      const locateSplit = window.location.href.split("#");

      if (locateSplit.length > 1) {
        for (let i = 0; i < this.posts.length; i++) {
          if (this.posts[i].id === locateSplit[1]) {
            postName = this.posts[i].title;
          }
        }
        newUrl = `/group/${this.groupName}/${postName}`;
      } else {
        newUrl = `/group/${this.groupName}`;
      }

      window.history.replaceState(null, null, newUrl);
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
.content p {
  margin-bottom: 0px;
}
.custom-tag:hover {
  cursor: pointer;
  background-color: #209ceea3 !important;
}
.post-detail {
  border: 1px solid rgba(232, 230, 227, 1);
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f5f5f5;
}
</style>
