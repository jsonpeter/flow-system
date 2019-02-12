<template>
  <v-footer
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span class="tertiary--text footer-links">联系方式：028-87777777</span>
    </div>
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href=""
        target="_blank">Creative Tim</a>, made with
      <v-icon
        color="tertiary"
        size="17">mdi-heart</v-icon>
      for a better web
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'Home', Link: '/dashboard' }
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
