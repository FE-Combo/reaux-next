import React from "react";
import { connect } from "react-redux";
import { actions } from "../index";

const Index = (props: any) => {
  const { name, dispatch } = props;
  const handleClick = () => {
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
