import React, { useEffect, useState } from "react";

//navbar at the top of the page
//write about today:
//journal entry
//list of past entries
const MyJournal = ({ user, setUser }) => {
  console.log(user);
  const [journal, setJournal] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    setUsername(user.username);
    setPassword(user.password);
    setJournal(user.journal);
    console.log("useEffect ran");
  }, [user.username, user.password, user.journal]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/journal/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, journal }),
      });

      const data = await response.json();
      setJournal(data[0].journal);
      setUser(data[0]);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <div className="my-journal-container">
    //   <h2 className="centered-text">My Journal</h2>
    //   <form onSubmit={handleSubmit}>
    //     <label htmlFor="Journal"></label>
    //     <br />
    //     <input
    //       type="text"
    //       value={journal}
    //       onChange={(event) => setJournal(event.target.value)}
    //     />
    //     <button type="submit">Submit</button>
    //   </form>
    // </div>
    <div className="my-journal-container">
      <div className="journal-box">
        <h2 className="centered-text">My Journal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Journal"></label>
          <br />
          <input
            type="text"
            value={journal}
            onChange={(event) => setJournal(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default MyJournal;
