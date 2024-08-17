//We have created this file so that we can write the code of maps that we have copied from mapbox website.
//" https://docs.mapbox.com/mapbox-gl-js/example/simple-map/ "

    {/* let mapToken = "<%= process.env.MAP_TOKEN %>";*/} {/*There is an error because, variables of .env file are accessible 
                                                       in ejs files. They are not accessible here. */}

	mapboxgl.accessToken = mapToken;{/* This variable "mapToken" is getting accessed because, we have saved the MAP_TOKEN enviormental 
                                        variable is the js variable- mapToken in show.ejs file.*/}
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        //Choose from mapbox's core styles. or make your own style with Mapbox Studio.
        style: "mapbox://styles/mapbox/streets-v12",// style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90.
                             // Here,i mapbox we are taking longitude first and latitude afterwards. But, generally we 
                             // take latitude first and longitude afterwards.
        zoom: 10 // starting zoom
    });

    console.log(listing.geometry.coordinates);

    //Below code we have taken from- "https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/"
    //Thsi will create a marker on the map according to the coordinates passed.
    const marker = new mapboxgl.Marker({ color: "#fe424d"})
        .setLngLat(listing.geometry.coordinates)// Here the coordinates will be those, that are saved inside the "listing.geometry.coordinates"
                                         // in models -> listing.js
                                         // We can't use these coordinates directly here, so we will store these variables
                                         // in js variable in show.ejs file top.

        // This below code we have taken from:- "https://docs.mapbox.com/mapbox-gl-js/api/markers/"
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h5>${listing.location}</h5><p>Exact location will be provided after booking</p>`
            )
        )

        .addTo(map);

//NOTE:- We can change the style of the marker on the map, for detail refer- "https://docs.mapbox.com/mapbox-gl-js/api/markers/"