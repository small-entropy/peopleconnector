<template lang="pug">
   v-app
      // Top-level application navigation bar
      v-app-bar(app fixed clipped-left)
         v-toolbar-title PeopleConnector <sup class="grey--text">v.0.0.1</sup>
         v-spacer
         v-btn(icon @click="logout" v-if="authorized")
            v-icon logout

      // Mobile sidebar
      v-navigation-drawer(app fixed clipped v-model="sidebar")
         v-list-item(two-line)
            v-list-item-avatar
               img(src='/img/avatar.png')
            v-list-item-content
               v-list-item-title {{ getName }}

         v-divider

         v-list(dense)
            v-list-item(to='/')
               v-list-item-icon
                  v-icon playlist_add_check
               v-list-item-content
                  v-list-item-title Главная

      // Main page content
      v-content
         nuxt

      // Top-level application footer
      v-footer(app fixed dark)
         span.caption &copy; 2019.
</template>

<script>
export default {
   head() {
      return {
         title: `Главная`
      }
   },

   data() {
      return {
         sidebar: null
      }
   },

   computed: {
      getName() {
         let name = 'Unknown user'
         if (this.userData) {
            name = `${this.userData.profile.surname} ${this.userData.profile.name} ${this.userData.profile.lastname}`
         }
         return name
      }
   }
}
</script>

<style lang="less">
html {
   width: 100%;
   height: 100%;
   overflow: hidden;
}

body {
   width: 100%;
   height: 100%;
   overflow: auto;
}
</style>