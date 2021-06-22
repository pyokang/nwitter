import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  // State Declaration
  const [edit, setEdit] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  // Functions Declaration
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    setEdit(false);
  };

  const onChange = (e) => {
    const {
      target: { file },
    } = e;
    setNewNweet(file);
  };

  const toggleEdit = () => setEdit((prev) => !prev);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.downloadUrl).delete();
    }
  };

  // HTML
  return (
    <div>
      <div className="nweet">
        {edit ? (
          <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input
                type="text"
                placeholder="Edit your nweet"
                value={newNweet}
                onChange={onChange}
                required
                autoFocus
                className="formInput"
              />
              <input type="submit" value="Update Nweet" className="formBtn" />
            </form>
            <button onClick={toggleEdit} className="formBtn cancelBtn">
              Cancel
            </button>
          </>
        ) : (
          <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.downloadUrl && <img src={nweetObj.downloadUrl} />}
            {isOwner && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEdit}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Nweet;
