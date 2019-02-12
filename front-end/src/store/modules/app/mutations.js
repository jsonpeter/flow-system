import { set, toggle } from '@/utils/vuex'

export default {
  setDrawer: set('drawer'),
  setImage: set('image'),
  setBgColor: set('bgcolor'),
  setColor: set('color'),
  toggleDrawer: toggle('drawer')
}
