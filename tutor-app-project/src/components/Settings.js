//Display settings change for a user when logged in

import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "./Accounts";
import ChangePassword from "./ChangePassword";

export default () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
    getSession().then(() => {
      setLoggedIn(true);
    });
  }, []);

  return (
    <div>
      {loggedIn && (
        <>
          <h5>Do you want to change password?</h5>
          <ChangePassword />
        </>
      )}
    </div>
  );
};