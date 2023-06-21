import React from 'react';
import {useDispatch} from "react-redux"
import {actions} from "../index"

export default () => {
  const dispatch = useDispatch();
  return (
  <div>about<button onClick={()=>dispatch(actions.test())}>Test</button><button onClick={()=>dispatch(actions.reset())}>Reset</button></div>
  )
};

