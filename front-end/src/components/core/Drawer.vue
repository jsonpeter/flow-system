<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-title class="title">
           <span style="text-align: center; display: block">管理后台</span>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
        <v-list-tile
                avatar
                :active-class="color"
                class="v-list-item" @click="loginOut">
          <v-list-tile-action>
            <v-icon>mdi-arrow-left</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>退出登录</v-list-tile-title>
        </v-list-tile>
      </v-layout>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    links: [
      {
        to: '/main/home',
        icon: 'mdi-poll',
        text: '统计报表'
      },
      {
        to: '/table-list',
        icon: 'mdi-face',
        text: '到店人群'
      },
        {
            to: '/camera',
            icon: 'mdi-desktop-classic',
            text: '实时监控'
        },
      {
            to: '/user-profile',
            icon: 'mdi-account',
            text: '商户信息'
        },
      {
        to: '/password',
        icon: 'mdi-lock',
        text: '密码修改'
      }
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
      loginOut(){
        sessionStorage.removeItem('access_token');
        this.$router.replace({ path: '/login' })
        console.log('~~')
      }
  }
}
</script>

<style lang="scss">
  #app-drawer {
    z-index: 99;
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
