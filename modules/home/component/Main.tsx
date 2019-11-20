import React from "react";
import { connect } from "react-redux";
import { actions } from "../index";

const Index = (props: any) => {
  console.info(props);
  const { name, dispatch } = props;
  const handleClick = () => {
    console.log(actions.clickButton());
    dispatch(actions.clickButton());
  };
  return (
    <div>
      <a>{name}</a>
      <button onClick={handleClick}>按钮</button>
    </div>
  );
};

export default connect((state: any) => {
  return { name: state.app.home.name };
})(Index);
