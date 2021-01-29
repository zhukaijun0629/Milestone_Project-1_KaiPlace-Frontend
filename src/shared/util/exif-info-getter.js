import date from "date-and-time";
import { sexagesimalToDecimal } from "geolib";
import moment from "moment-timezone";

const getTakenAtFromBing = async (dateTimeOriginal, lat, lng) => {
  const dateOriginal = dateTimeOriginal.split(" ")[0].replaceAll(":", "-");
  const timeOriginal = dateTimeOriginal.split(" ")[1];

  try {
    const response = await fetch(
      `https://dev.virtualearth.net/REST/v1/timezone/${lat},${lng}?key=${process.env.REACT_APP_BING_MAP_KEY}`
    );
    const responseData = await response.json();
    const timeZoneOriginal =
      responseData.resourceSets[0].resources[0].timeZone.ianaTimeZoneId;
    const takenAt = new Date(
      moment.tz(`${dateOriginal} ${timeOriginal}`, timeZoneOriginal)
    );
    return takenAt;
  } catch (error) {}
};

export const getTakenAt = async (metaData, pickedFile) => {
  let dateTimeOriginal = metaData.DateTimeOriginal;
  let gpsDateStamp = metaData.GPSDateStamp;
  let gpsTimeStamp = metaData.GPSTimeStamp;
  let gpsLatitude = metaData.GPSLatitude;
  let gpsLatitudeRef = metaData.GPSLatitudeRef;
  let gpsLongitude = metaData.GPSLongitude;
  let gpsLongitudeRef = metaData.GPSLongitudeRef;

  let lat;
  if (gpsLatitude && gpsLatitudeRef) {
    lat = sexagesimalToDecimal(
      `${gpsLatitude[0]}° ${gpsLatitude[1]}' ${gpsLatitude[2]}" ${gpsLatitudeRef}`
    );
    // console.log(lat);
  }
  let lng;
  if (gpsLongitude && gpsLongitudeRef) {
    lng = sexagesimalToDecimal(
      `${gpsLongitude[0]}° ${gpsLongitude[1]}' ${gpsLongitude[2]}" ${gpsLongitudeRef}`
    );
    // console.log(lng);
  }

  let takenAt;
  if (gpsDateStamp && gpsTimeStamp) {
    gpsTimeStamp[2] = parseInt(gpsTimeStamp[2]);
    gpsTimeStamp = gpsTimeStamp.join(":");
    const pattern = date.compile("YYYY:MM:DD h:m:s");
    takenAt = new Date(
      date.parse(gpsDateStamp + " " + gpsTimeStamp, pattern, true)
    );
  } else if (dateTimeOriginal && lat && lng) {
    try {
      takenAt = await getTakenAtFromBing(dateTimeOriginal, lat, lng);
    } catch (error) {}
  } else if (dateTimeOriginal) {
    const dateOriginal = dateTimeOriginal.split(" ")[0].replaceAll(":", "-");
    const timeOriginal = dateTimeOriginal.split(" ")[1];
    takenAt = new Date(dateOriginal + "T" + timeOriginal);
  } else if (pickedFile.lastModifiedDate) {
    takenAt = new Date(pickedFile.lastModifiedDate);
  } else {
    takenAt = new Date();
  }
  return { takenAt, lat, lng };
};

export const addressAt = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      let results = data.results;
      let address;
      for (let result of results) {
        if (result.types.includes("sublocality", "political")) {
          address = result.formatted_address;
          break;
        } else if (result.types.includes("locality", "political")) {
          address = result.formatted_address;
          break;
        }
      }
      if (!address) {
        address = results[0].formatted_address
      }
      return address
    } else {
      return null;
    }
  } catch (error) {}
};
