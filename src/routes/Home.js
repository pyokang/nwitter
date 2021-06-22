import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    async function getNweets() {
      const data = await dbService.collection("nweets").get();
      data.forEach((document) => {
        const nweetObject = {
          ...document.data(),
          id: document.id,
        };
        setNweets((prev) => [nweetObject, ...prev]);
      });
    }
    getNweets();
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

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

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={(e) => {
            setNweet(e.target.value);
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = (finishedEvent) => {
              setFileURL(finishedEvent.currentTarget.result);
            };
            reader.readAsDataURL(file);
          }}
        />
        <input type="submit" value="Nweet" />
        {fileURL && (
          <div>
            <img src={fileURL} width="50px" height="50px" alt="Thumbnail" />
            <button
              onClick={(e) => {
                setFileURL("");
              }}
            >
              Clear
            </button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
