mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12", //style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});



// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates) 
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${listing.title}!</h3><p>Exact location will be provided after booking</p>`)
    .setMaxWidth("300px"))
    
    .addTo(map);
