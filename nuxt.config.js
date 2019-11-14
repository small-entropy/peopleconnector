import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()

export default {
   mode: 'universal',

   head: {
      titleTemplate: `%s - Dating-платформа`,
      title: 'Главная',
      meta: [
         { charset: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
         { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
         { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
   },

   loading: { color: '#fff' },

   plugins: [
      '~/plugins/globals'
   ],

   modules: [
      '@nuxtjs/axios',
      '@nuxtjs/vuetify',
      '@nuxtjs/moment',
      'cookie-universal-nuxt'
   ],

   serverMiddleware: [
      bodyParser.json(),
      '~/server/routes/index.js'
   ],

   axios: {
      credentials: true,
      prefix: '/server/',
      https: false
   },

   watch: ['server']
}
