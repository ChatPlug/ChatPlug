import { Nuxt, Builder } from 'nuxt'

export default function dashboardHttpHandler() {
  // Require Nuxt config
  const config = require('./nuxt.config.js')

  // Create a new Nuxt instance
  const nuxt = new Nuxt(config)

  // Enable live build & reloading on dev
  if (nuxt.options.dev) {
    new Builder(nuxt).build()
  }
  return (req, res) => nuxt.render(req, res)
}
