import React, { Component } from 'react';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import OLCesium from 'olcs/OLCesium.js';

require('ol/ol.css');

class MapView extends Component {

  componentDidMount() {

    // create feature layer and vector source
    var featuresLayer = new VectorLayer({
      source: new VectorSource({
        features:[]
      })
    });

    // create map object with feature layer
    var map = new Map({
      target: this.refs.mapContainer,
      layers: [
        //default OSM layer
        new TileLayer({
          source: new OSM()
        }),
        featuresLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 13,
      })
    });

    var geolocation = new Geolocation({
      projection: map.getView().getProjection(),
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
        maximumAge: 2000
      }
    });

    geolocation.on('error', function(error) {
      console.log("Geolocation Error");
    });

    // After rendering the map, center and zoom user's location
    map.once("change", function(){
      map.setView(new View({
        center: geolocation.getPosition(),
        zoom: 15
      }));
    });

        this.setState({ map, featuresLayer});
      }

      // pass new features from props into the OpenLayers layer object
      componentDidUpdate(prevProps, prevState) {
        this.state.featuresLayer.setSource(
          new VectorSource({
            features: this.props.routes
          })
        );
      }

  render() {
    return (
      <div ref="mapContainer" style={{height: this.props.height, width: this.props.width}}> </div>
    );
  }
}

export default MapView;
