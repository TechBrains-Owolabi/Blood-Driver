import app from './app';
const geocoder = require('./services/geocoder')

app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
  console.log(process.env.MONGOURI);
});
