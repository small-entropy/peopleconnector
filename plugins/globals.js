export default function ({ $axios, store }) {
   $axios.onRequest(config => {
      if (store.state.auth && store.state.auth.token) {
         config.headers.common['Authorization'] = store.state.auth.token
      }
   })
}