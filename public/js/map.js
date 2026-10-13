    // let mapToken = "<%=process.env.MAP_TOKEN%>";
    console.log("Map token:", mapToken);
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center:listing.geometry.coordinates, // center the map on this longitude and latitude[30,15]
    });
    console.log(map.accessToken);
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
            (error, image) => {
                if (error) throw error;
                // Add the image to the map style.
                map.addImage('cat', image);
        });
         map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                        'icon-image': 'cat', // reference the image
                        'icon-size': 0.25
                    }
                });
    });

    const marker1 = new mapboxgl.Marker({color : 'red'})
        .setLngLat(listing.geometry.coordinates)//Longitude and Latitude
        .setPopup(new mapboxgl.Popup({offset: 25})
            .setHTML(`<h3>${listing.location}</h3><p>Exact location provided after booking</p>`))
        .addTo(map);
