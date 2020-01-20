import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { actions } from "../index";
import { helper } from "../../../framework";

const Index = (props: any) => {
  const { loading, name, dispatch } = props;

  const handleButtonClick = () => dispatch(actions.clickButton());
  const handleGlobalButtonClick = () => dispatch(actions.clickGlobalButton());
  const changeLang = (lang: string) => {
    //
  };
  return (
    <>
      <div>
        <span>{name}</span>
        &nbsp;&nbsp;
        <Button onClick={handleButtonClick} loading={loading}>
          局部加载
        </Button>
        &nbsp;&nbsp;
        <Button onClick={handleGlobalButtonClick}>全局加载</Button>
      </div>
      <br />
      <div>
        <span>语言：未设置</span>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("ZH")}>设置为中文</Button>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("EN")}>设置为英文</Button>
      </div>
    </>
  );
};

export default connect((state: any) => {
  return {
    name: state.home.name,
    loading: helper.isLoading("button")
  };
})(Index);
