import React from "react";

//nav bar
//State's Rights and You
//Blurb about states rights etc
//Queer Parentage
//Trans Rights info
//Abortion Rights
//IVF insurance rights

const StatesRights = () => {
  return (
    <div className="centered-container">
      <h1>States Rights and You</h1>
      <h3>
        Living in the "United" States of America can be tough right now.
        Especially since each state has it's own agenda when it comes to
        abortion, trans and GLBQI rights. Need the info?
      </h3>
      <h3>
        Check out these amazing websites and see how each state "scores":{" "}
      </h3>
      <h2>
        <a
          href="https://www.lgbtmap.org/equality-maps"
          target="_blank"
          rel="noopener noreferrer"
        >
          LGBTQI Interactive Map
        </a>
      </h2>
      <h2>
        <a
          href="https://www.hrc.org/resources/state-scorecards"
          target="_blank"
          rel="noopener noreferrer"
        >
          LGBTQI State Score Cards
        </a>
      </h2>
      <h2>
        <a
          href="https://www.abortionfinder.org/abortion-guides-by-state"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abortion Rights Per State
        </a>
      </h2>
    </div>
  );
};

export default StatesRights;
