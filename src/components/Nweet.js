import React, { useState } from "react";
import { dbService, storageService } from "../fbase";

const Nweet = ({ nweetObj, isOwner }) => {
  const [edit, setEdit] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const toggleEdit = () => setEdit(!edit);
  return (
    <div>
      {edit ? (
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await dbService
                .doc(`nweets/${nweetObj.id}`)
                .update({ text: newNweet });
              setEdit(false);
            }}
          >
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={(e) => {
                setNewNweet(e.target.value);
              }}
              required
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.downloadUrl && (
            <img
              src={nweetObj.downloadUrl}
              width="50px"
              height="50px"
              alt="Thumbnail"
            />
          )}
          {isOwner && (
            <>
              <button
                onClick={async (e) => {
                  const ok = window.confirm(
                    "Are you sure you want to delete this nweet?"
                  );
                  if (ok) {
                    await dbService.doc(`nweets/${nweetObj.id}`).delete();
                    await storageService
                      .refFromURL(nweetObj.downloadUrl)
                      .delete();
                  }
                }}
              >
                Delete Nweet
              </button>
              <button onClick={toggleEdit}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
