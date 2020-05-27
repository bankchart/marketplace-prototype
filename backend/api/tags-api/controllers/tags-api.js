'ue strict';

module.exports = {
  newTags: async (ctx, next) => {
    let newTags = [];
    ctx.set('content-type', 'application/json');
    if (ctx.request.body.tags && ctx.request.body.tags.length > 0) {
      let tagTmp = '';
      try {
        for (let tag of ctx.request.body.tags) {
          tagTmp = tag;
          const result = await strapi.query('category')
          .create({ name: tag });
          newTags.push(result.id);
        }
        ctx.body = JSON.stringify({ tags: newTags });
      } catch (e) {
        console.error(e);
        let message = e.message;
        if (e.message.includes('SQLITE_CONSTRAINT')) {
          message = "Duplicate tag: " + tagTmp;
        }
        ctx.status = 500;
        ctx.body = JSON.stringify({ error: message });
      }
    } else {
      ctx.status = 500;
      ctx.body = JSON.stringify({ error: "Invalid tags" });
    }
  },

  posts: async (ctx, next) => {
    ctx.set('content-type', 'application/json');

    const catName = ctx.request.query.name;
    const groupId = ctx.request.query.groupId;
    const posts = [];

    const result = await strapi
      .query('post').find();
    
    for (let post of result) {
      if (post.categories.length > 0) {
        for (let cat of post.categories) {
          if (catName === cat.name && parseInt(groupId) === post.group.id) {
            posts.push(post);
          }
        }
      }
    }

    console.log(posts);   

    ctx.body = JSON.stringify(posts);
  }
};
