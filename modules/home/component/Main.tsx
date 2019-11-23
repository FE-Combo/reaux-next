import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { actions } from "../index";
import { helper } from "../../../framework";

const Index = (props: any) => {
  const { isLoading, name, lang, dispatch } = props;

  const handleButtonClick = () => dispatch(actions.clickButton());
  const handleGlobalButtonClick = () => dispatch(actions.clickGlobalButton());
  const changeLang = (lang: string) => (helper.lang = lang);
  return (
    <>
      <div>
        <span>{name}</span>
        &nbsp;&nbsp;
        <Button onClick={handleButtonClick} loading={isLoading}>
          局部loading按钮
        </Button>
        &nbsp;&nbsp;
        <Button onClick={handleGlobalButtonClick}>全局loading按钮</Button>
      </div>
      <br />
      <div>
        <span>语言：{lang || "未设置"}</span>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("CN")}>置为CN</Button>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("US")}>置为US</Button>
      </div>
    </>
  );
};

export default connect((state: any) => {
  return {
    name: state.app.home.name,
    isLoading: helper.isLoading("button"),
    lang: helper.lang
  };
})(Index);
