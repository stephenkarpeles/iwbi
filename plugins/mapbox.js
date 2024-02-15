import Vue from 'vue'
import {
  MglMap,
  MglGeolocateControl,
  MglMarker,
  MglPopup,
  MglGeojsonLayer,
} from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

Vue.component('MglMap', MglMap)
Vue.component('MglPopup', MglPopup)
Vue.component('MglMarker', MglMarker)
Vue.component('MglGeolocateControl', MglGeolocateControl)
Vue.component('MglGeojsonLayer', MglGeojsonLayer)

Vue.prototype.$mapbox = Mapbox
