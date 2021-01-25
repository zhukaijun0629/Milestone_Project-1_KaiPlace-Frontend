import React, { useRef, useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

import Button from "./Button";
import "./ImageUpload.css";
import "./Input.css";

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

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      imageCompression(pickedFile, options)
        .then(function (compressedFile) {
          setFile(compressedFile);
          setIsValid(true);
          fileIsValid = true;
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
