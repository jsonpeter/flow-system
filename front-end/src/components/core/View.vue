<template>
  <v-content>
    <div id="core-view">
      <core-toolbar />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
    <!--<core-footer v-if="$route.name !== 'Maps'" />-->
  </v-content>
</template>

<script>

</script>

<style>
#core-view {
  padding-top: 3rem;
}
</style>
