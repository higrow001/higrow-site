"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const App = () => {
  return (
    <div>
      <span>App</span>
      <button onClick={() => signOut(auth)}>sign out</button>
    </div>
  );
};

export default App;
