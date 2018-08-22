const path = require("path")
const parseArgs = require("minimist")
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: "hostname",
    p: "port"
  },
  string: ["H"],
  unknown: parameter => false
})

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  "3000"
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  "localhost"
module.exports = {
  mode: 'spa',
  rootDir: __dirname,
  env: {
    baseUrl:
      process.env.BASE_URL ||
      `http://${host}:${port}`
  },
  head: {
    title: "ChatPlug Dashboard",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: "Nuxt.js project"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  plugins: ['~/plugins/vuetify.js'],
  css: [
    {
        src: path.join(__dirname, 'assets/css/app.styl'),
        lang: 'styl'
    }
  ],
  build: {
    vendor: ['~/plugins/vuetify.js'],
    extractCSS: true,
  },
  modules: [
    "@nuxtjs/axios",
    "~/modules/typescript.js",
    "nuxt-material-design-icons"
  ],
  axios: {}
}
