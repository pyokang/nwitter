import React, { useState } from "react";
import { authService, firebaseInstance } from "../fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [, setError] = useState("");

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let data;
          try {
            if (newAccount) {
              //Create Accout
              data = await authService.createUserWithEmailAndPassword(
                email,
                password
              );
            } else {
              //Login
              data = await authService.signInWithEmailAndPassword(
                email,
                password
              );
            }
            console.log(data);
          } catch (error) {
            console.log(error.message);
            setError(error.message);
          }
        }}
      >
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button
          name="google"
          onClick={async (e) => {
            const provider = new firebaseInstance.auth.GoogleAuthProvider();
            await authService.signInWithPopup(provider);
          }}
        >
          Continue with Google
        </button>
        <button
          name="github"
          onClick={async (e) => {
            const provider = new firebaseInstance.auth.GithubAuthProvider();
            await authService.signInWithPopup(provider);
          }}
        >
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
