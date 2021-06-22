import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateNweet = ({ userObj }) => {
  // States
  const [nweet, setNweet] = useState("");
  const [fileURL, setFileURL] = useState("");

  // Functions
  const onSubmit = async (e) => {
    e.preventDefault();
    let downloadUrl = "";
    if (fileURL !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const res = await fileRef.putString(fileURL, "DATA_URL");
      downloadUrl = await res.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      downloadUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setFileURL("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      setFileURL(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(file);
  };

  const onClearFile = () => {
    setFileURL("");
  };

  // HTML
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {fileURL && (
        <div className="factoryForm__attachment">
          <img
            src={fileURL}
            style={{
              backgroundImage: fileURL,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearFile}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default CreateNweet;
