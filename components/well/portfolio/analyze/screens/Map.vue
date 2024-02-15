<template>
  <client-only>
    <div class="relative h-full">
      <div id="map" class="absolute top-0 bottom-0 h-full w-full"></div>
    </div>
  </client-only>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import mapboxgl from 'mapbox-gl'
export default {
  data() {
    return {
      accessToken:
        'pk.eyJ1Ijoic2NoaWthcmEiLCJhIjoiY2p6YWM0NXJnMDBzbDNtcXFtMWl6OGFuOSJ9.7I-CFVvvnvodsibCNbXT_Q',
      mapStyle: 'mapbox://styles/mapbox/light-v10',
    }
  },
  computed: {
    ...mapState({
      locations: (state) => state.portfolio.locations,
      projectGeoJson: (state) => state.analyze.projectGeoJson,
      projectsByLocation: (state) => state.analyze.projectsByLocation,
    }),
    ...mapGetters({
      propertyCount: 'portfolio/totalPropertyCount',
      areaCount: 'portfolio/totalAreaCount',
      locationCoordinates: 'portfolio/coordinateList',
    }),
  },
  async mounted() {
    await this.loadProjectGeoJson()
    this.onMapLoaded()
  },
  methods: {
    ...mapActions('analyze', ['loadProjectBreakdown', 'loadProjectGeoJson']),
    onMapLoaded(event) {
      mapboxgl.accessToken = this.accessToken
      const map = new mapboxgl.Map({
        container: 'map',
        style: this.mapStyle,
        center: [0, 0],
        zoom: 1,
      })

      map.on('load', () => {
        map.addSource('properties', {
          type: 'geojson',
          data: { ...this.projectGeoJson },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'properties',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        })

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'properties',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
          },
        })

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'properties',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        })

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          })
          const clusterId = features[0].properties.cluster_id
          map
            .getSource('properties')
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return
              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom,
              })
            })
        })
        map.resize()

        map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice()
          const list = []
          e.features.forEach((e) => {
            if (!list.includes(e.properties.name)) {
              list.push(e.properties.name)
            }
          })
          const name = list.join(', ')

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`${name}`)
            .addTo(map)
        })

        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = ''
        })
      })
    },
    roundVal(val) {
      if (val > 1e6) {
        return Math.round((val / 1e6) * 1000) / 1000 + 'M'
      } else if (val > 1e3) {
        return Math.round((val / 1e3) * 100) / 100 + 'K'
      }
      return val
    },
  },
}
</script>
<style>
.mapboxgl-control-container {
  display: none;
}
</style>
<style>
.mapboxgl-popup-content {
  background: #0f2329;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
}

.mapboxgl-popup-close-button {
  font-size: 15px;
  line-height: 1.75rem;
  font-weight: 700;
  right: 0.5rem;
  position: absolute;
  top: 0px;
}
.mapboxgl-popup {
  position: absolute;
  top: 15%;
}
</style>
