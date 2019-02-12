<template>
  <v-toolbar
    id="core-toolbar"
    flat
    prominent
    class="head-tool"
  >
    <v-toolbar-title
            class="default font-weight-light"
    >
      <v-btn
              v-if="responsive"
              class="default v-btn--simple"
              dark
              icon
              @click.stop="onClickBtn"
      >
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
      <span class="head-title">{{ title }}</span>
    </v-toolbar-title>

  </v-toolbar>
</template>

<script>

import {
  mapMutations
} from 'vuex'

export default {
    data: () => ({
        notifications: [
            'Mike, John responded to your email',
            'You have 5 new tasks',
            'You\'re now a friend with Andrew',
            'Another Notification',
            'Another One'
        ],
        title: null,
        responsive: false,
        responsiveInput: false
    }),

    watch: {
        '$route'(val) {
            this.title = val.name
        }
    },

    mounted() {
        this.onResponsiveInverted()
        window.addEventListener('resize', this.onResponsiveInverted)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResponsiveInverted)
    },
    methods: {
        ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
        onClickBtn() {
            this.setDrawer(!this.$store.state.app.drawer)
        },
        onResponsiveInverted() {
            if (window.innerWidth < 991) {
                this.responsive = true
                this.responsiveInput = false
            } else {
                this.responsive = false
                this.responsiveInput = true
            }
        }
    }
}
</script>

<style>
  .theme--dark .head-title{
    color: #ffffff;
  }
  .head-title{
    color: #333;
  }
  #core-toolbar a {
    text-decoration: none;
  }
</style>
