/* global L */

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
