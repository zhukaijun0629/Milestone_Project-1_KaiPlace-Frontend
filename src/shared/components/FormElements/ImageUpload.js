import React, { useRef, useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import EXIF from "exif-js";
// import date from "date-and-time";
// import { sexagesimalToDecimal } from "geolib";
// import moment from "moment-timezone";

import Button from "./Button";
import "./ImageUpload.css";
import "./Input.css";
import { getTakenAt, addressAt } from "../../util/exif-info-getter";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(props.initialValue || null);
  const [isValid, setIsValid] = useState(props.initialValid || false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = async (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      // const parser = require("exif-parser").create(pickedFile);
      // const result = parser.parse();
      // console.log(result);

      const getGpsData = (pickedFile) => {
        return new Promise((resolve, reject) => {
          EXIF.getData(pickedFile, function () {
            const allMetaData = EXIF.getAllTags(this);
            resolve(allMetaData);
          });
        });
      };

      const metaData = await getGpsData(pickedFile);
      // console.log(metaData);
      const { takenAt, lat, lng } = await getTakenAt(metaData, pickedFile);
      // console.log(takenAt);

      let address;
      if (lat && lng) {
        address = await addressAt(lat, lng);
      }
      // console.log(address);

      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };

      imageCompression(pickedFile, options)
        .then(function (compressedFile) {
          setFile(compressedFile);
          setIsValid(true);
          fileIsValid = true;
          compressedFile.takenAt = takenAt;
          compressedFile.lat = lat;
          compressedFile.lng = lng;
          compressedFile.address = address;
          // console.log(compressedFile);
          props.onInput(props.id, compressedFile, fileIsValid);
        })
        .catch(function (err) {
          alert(err.message);
        });

      // setFile(pickedFile);
      // setIsValid(true);
      // fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jepg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview" onClick={pickImageHandler}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button inverse type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
