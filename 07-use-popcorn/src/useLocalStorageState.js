import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, keyName) {
  //use parameter as initial value from local storage
  const [value, setValue] = useState(function () {
    const val = localStorage.getItem(keyName);
    //revert from string to object
    return val ? JSON.parse(val) : initialState;
  });

  useEffect(
    function () {
      //localStorage can only accept a string so convert object to string

      localStorage.setItem(keyName, JSON.stringify(value));
    },
    [value, keyName], //don't forget to pass dependencies
  );

  return [value, setValue];
}
