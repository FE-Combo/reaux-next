import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { actions } from "../index";
import { helper } from "../../../framework";
import { useLocales } from "../../../utils/locales";

const Index = (props: any) => {
  const t = useLocales();
  const { loading, name, l, dispatch } = props;

  const handleButtonClick = () => dispatch(actions.clickButton());
  const handleGlobalButtonClick = () => dispatch(actions.clickGlobalButton());
  const changeLang = (lang: string) => (helper.lang = lang);
  return (
    <>
      <div>
        <span>{name}</span>
        &nbsp;&nbsp;
        <Button onClick={handleButtonClick} loading={loading}>
          {t.partialLoading}
        </Button>
        &nbsp;&nbsp;
        <Button onClick={handleGlobalButtonClick}>{t.globalLoading}</Button>
      </div>
      <br />
      <div>
        <span>
          {t.language}：{l || t.notSet}
        </span>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("ZH")}>{t.SetToZH}</Button>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang("EN")}>{t.SetToEN}</Button>
      </div>
    </>
  );
};

export default connect((state: any) => {
  return {
    name: state.app.home.name,
    loading: helper.isLoading("button")
  };
})(Index);
