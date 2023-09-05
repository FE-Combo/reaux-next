import React from 'react';
import {useDispatch} from "react-redux"
import {actions} from "../index"

interface Props {
  name?: string;
}
export default (props: Props) => {
  const {name} = props;
  const dispatch = useDispatch();
  return (
    <div>
      <div>about {name}</div>
      <button onClick={()=>dispatch(actions.test())}>change</button>
      <button onClick={()=>dispatch(actions.setState({name:"new about"}))}>set state</button>
      <button onClick={()=>dispatch(actions.resetState())}>reset</button>
    </div>
  )
};

