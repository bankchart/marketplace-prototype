'use strict';

module.exports = {
  reg: async (ctx, next) => {
    const axios = require('axios');
    const facebook_userid = ctx.request.body.facebook_userid;
    const email = ctx.request.body.email;
    
    const users = await strapi.query('user', 'users-permissions')
    .findOne({ facebook_userid });
    
    const secret = await strapi.query('secure-secret')
    .findOne({ id: 1 });
    
    const username = email;
    const password = `${facebook_userid}.${secret.postfix_pass_secret}`;
    
    try {
      if (!users) {
       
        const name = ctx.request.body.name.trim();
        const first_name = name.split(/(\s+)/)[0] || null;
        const last_name = name.split(/(\s+)/)[2] || null;
        
        const regResult = await axios
          .post('http://localhost:1337/auth/local/register', 
          {
            username,
            email,
            password
          });

        await strapi.query('user', 'users-permissions')
          .update(
            { username },
            {
              first_name,
              last_name,
              facebook_userid,
              confirmed: false
            }
          )

        ctx.body = {
          userId: regResult.data.user.id,
          jwt: regResult.data.jwt
        };
      } else {
        const loginResult = await axios
          .post('http://localhost:1337/auth/local', {
            identifier: username,
            password
          });
        console.log(loginResult.data.user);
        console.log(loginResult.data.jwt);
        ctx.body = {
          userId: loginResult.data.user.id,
          jwt: loginResult.data.jwt
        };
      }
    } catch (e) {
      console.log(e);
      ctx.status = 500;
      ctx.body = e.message;
    }
  }
};
