<template>
  <v-menu
    :close-on-content-click="false"
    bottom
    left
    min-width="300"
    max-width="300"
    nudge-left="12"
    offset-x
    transition="slide-y-transition"
  >
    <v-btn
      slot="activator"
      class="elevation-0"
      color="grey"
      dark
      fab
      fixed
      style="top: 96px;"
      top
    >
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <v-card>
      <v-container grid-list-xl>
        <v-layout wrap>
            <v-flex xs12>
                <h4 class="text-xs-center">背景颜色</h4>
                <v-layout justify-center>
                    <v-radio-group v-model="bgcolor" row>
                        <v-radio label="浅色系" :value="true"></v-radio>
                        <v-radio label="深色系" :value="false"></v-radio>
                    </v-radio-group>
                </v-layout>
            </v-flex>
          <v-flex>
            <h4 class="text-xs-center">菜单颜色</h4>
            <v-layout justify-center>
              <v-avatar
                v-for="c in colors"
                :key="c"
                :class="[c === color ? 'color-active color-' + c: 'color-' + c]"
                size="23"

                @click="setColor(c)"
              />
            </v-layout>
          </v-flex>
          <v-flex
            xs12>
            <h4 class="text-xs-center">菜单背景</h4>
          </v-flex>
          <v-flex
            v-for="img in images"
            :key="img"
            xs3
          >
            <v-img
              :class="[image === img ? 'image-active' : '']"
              :src="img"
              height="120"
              @click.native="setImage(img)"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    colors: [
      'primary',
      'info',
      'success',
      'warning',
      'danger'
    ],
    images: []
  }),

  computed: {
    ...mapState('app', ['image', 'color','bgcolor']),
    color () {
      return this.$store.state.app.color
    },
    bgcolor:{
        get(){
            return this.$store.state.app.bgcolor
        },
        set (val) {
            console.log(val)
            this.setBgColor(val)
        }
    }
  },

  methods: {
    ...mapMutations('app', ['setImage','setBgColor']),
    setColor (color) {
      this.$store.state.app.color = color

    }
  }
}
</script>

<style lang="scss">
  .v-avatar,
  .v-responsive {
    cursor: pointer;
  }
    .v-input__control{
        margin: 0 auto;
    }
</style>
