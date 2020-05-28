require("dotenv").config();
export default {
  mode: "spa",
  router: {
    // mode: "hash",
    middleware: ["auth", "appMiddleware"]
  },
  auth: {
    strategies: {
      facebook: {
        client_id: "823538334721258",
        authorization_endpoint: "https://facebook.com/v2.12/dialog/oauth",
        userinfo_endpoint:
          "https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email",
        scope: ["public_profile", "email"]
        // redirect_uri: "https://9bkfullstackd.com/login"
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    // ...
    "node_modules/quill/dist/quill.core.css",
    // for snow theme
    "node_modules/quill/dist/quill.snow.css",
    // for bubble theme
    "node_modules/quill/dist/quill.bubble.css"
    // ...
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~plugins/nuxt-quill-plugin", ssr: false },
    { src: "~/plugins/vue-tags-input", ssr: false },
    "~plugins/nuxt-axios.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/dotenv",
    [
      "nuxt-fontawesome",
      {
        component: "fa",
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: ["fas"]
          },
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: ["fab"]
          }
        ]
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.MARKET_ENV === "dev"
        ? "https://localhost/strapi"
        : "https://9bkfullstackd.com/strapi"
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    vendor: ["@johmun/vue-tags-input"],
    extend(config, ctx) {}
  }
};
