/* global L, fetch */

const map = document.getElementById('map')
const frabl = map.getAttribute('data-frabl')

fetch(`/markers/${frabl}`)
  .then(res => res.json())
  .then(data => {
    if (!data.error) {
      initMap(data)
    } else {
      console.error(data.error)
    }
  })
  .catch(err => console.error(err))

function initMap (data) {
  const coordinates = {
    lat: 52.370216,
    long: 4.895168
  }

  const map = L.map('map').setView([coordinates.lat, coordinates.long], 11)
  // map.dragging.disable()

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // subdomains: 'abcd',
    maxZoom: 13,
    minZoom: 11
  })
    .addTo(map)

  console.log(data)

  data.locations.location.forEach(location => {
    if (location.available === 'true') {
      L.marker([location.holding.latitude, location.holding.longitude], { icon: icon('green') })
        .addTo(map)
        .bindPopup(`Beschikbaar in: ${location.name}`)
    } else {
      L.marker([location.holding.latitude, location.holding.longitude], { icon: icon('red') })
        .addTo(map)
        .bindPopup('Something')
    }
  })
}

function icon (color) {
  return L.icon({
    iconUrl: `../images/marker-${color}.png`,

    iconSize: [ 38, 60 ],
    iconAnchor: [ 22, 59 ],
    popupAnchor: [-3, -76]
  })
}
