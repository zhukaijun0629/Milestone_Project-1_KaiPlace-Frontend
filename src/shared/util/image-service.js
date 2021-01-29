import EXIF from 'exif-js';

const ImageService = {

  async getEXIFCoordinates(pickedFile) {


    // convert to DDD coordinate format as used by the Geolocation API
    function sanitizeEXIFCoordinate(coords, ref) {
      if (coords === undefined) return '';

      // resolve possible fractions as per spec (eg. stores [dd/1, mmmm/100, 0/1] for DMM format) and aggregate
      let coordinate = coords.reduce((sum, val, idx) => {
        return sum + (val.numerator / val.denominator) / Math.pow(60, idx)
      }, 0);

      // account for coordinate quadrant
      if (ref === 'S' || ref === 'W') {
        coordinate = -coordinate;
      }

      return coordinate;
    }

    function extractCoordinates() {
      EXIF.getData(pickedFile, function() {
        let lat = EXIF.getTag(this, 'GPSLatitude');
        let ref = EXIF.getTag(this, 'GPSLatitudeRef');
        lat = sanitizeEXIFCoordinate(lat, ref);

        let lng = EXIF.getTag(this, 'GPSLongitude');
        ref = EXIF.getTag(this, 'GPSLongitudeRef');
        lng = sanitizeEXIFCoordinate(lng, ref);
        pickedFile.lat = lat;
        pickedFile.lng = lng;
      });
    }

    function load() {
      return new Promise(function (resolve, reject) {
        pickedFile.onload = resolve;
      });
    }

    await load().then(extractCoordinates);
    return { lat: pickedFile.lat, lng: pickedFile.lng };
  },
};

export default ImageService;