const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: process.env.GEOCODE_PROVIDER,
 httpAdapter: 'https',
  // Optional depending on the providers
  apiKey: process.env.GEOCODE_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder;