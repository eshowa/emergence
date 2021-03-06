import React from 'react'

// Leaflet does not allow server side rendering
// This component loads the map on page load dynamically

class Map extends React.Component {

  mapStyle = {
    height: "90vh",
    margin: "-24px",
    border: "1px solid #000000"
  }

  constructor() {
    super()

    //Set Defaults
    this.state = {}

    this.setupMap = this.setupMap.bind(this)
  }

  setupMap(m){
    try {
      let L = require('leaflet')
      let HM = require('leaflet-heatmap')
      let map = L.map(m)
      let layerControl = L.control.layers()
      layerControl.addTo(map)

      // Locate user on map
      map.locate({ setView: true, maxZoom: 16 })
      map.on('locationerror', (e) => map.setView([34.414079, -119.876107], 16))


      //Create Base Layer (tiles to overlay on)
      let baseLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
          maxZoom: 18
        }
      )
      map.addLayer(baseLayer)

      console.log(this.props.layers)
      this.props.layers.map(lyr => {
        console.log(lyr)

        let layer
        if (lyr.type === "heatmap") {
          layer = new HM({
            radius: lyr.radius,
            maxOpacity: .8,
            scaleRadius: true, // scales the radius based on map zoom
            useLocalExtrema: false,  // if false uses the global maximum for colorization
            latField: lyr.latField,
            lngField: lyr.lngField,
            valueField: lyr.valueField
          })
          layer.setData(lyr)
        }
        //map.addLayer(layer)
        layerControl.addOverlay(layer, lyr.name)

      })

    }
    catch (e) {
      console.log(e)
      m = "Map Not supported"
    }
  }

  componentWillMount() {
  }

  render() {
    return(
      <>
       <div id="map" ref={this.setupMap}  style={this.mapStyle} />
      </>
    )
  }
}

export default Map
