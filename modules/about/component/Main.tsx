import React from 'react';
import {useDispatch} from "react-redux"
import {actions} from "../index"

export default () => {
  const dispatch = useDispatch();
  return (
    <div>
      <div>about</div>
      <button onClick={()=>dispatch(actions.test())}>change</button>
      <button onClick={()=>dispatch(actions.setState({name:"new about"}))}>set state</button>
      <button onClick={()=>dispatch(actions.resetState())}>reset</button>
    </div>
  )
};

