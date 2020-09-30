import React from "react";
import { Spin, Icon } from "antd";
import { connect } from "react-redux";
import Link from "next/link";
import { helper } from "../../../framework";
import * as I18nStore from "dot-i18n/node/i18n-store.js";
import locales from "../../../locales"
import "antd/dist/antd.css";

I18nStore.createContext();
const I18nContext = I18nStore.getContext();

interface Props {
  isLoading: boolean;
  Component: React.ComponentType<any>; // router component
  pageProps: object; // router component props
}

const Index = (props: Props) => {
  const { isLoading, Component, pageProps } = props;
  return (
    <I18nContext.Provider value={locales.zh}>
      <Spin
        spinning={isLoading}
        indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
      >

        <div>
          <Link href="/home">
            <a style={{ color: "#000", fontSize: 30 }}>home</a>
          </Link>
          &nbsp;&nbsp;
          <Link href="/about">
            <a style={{ color: "#000", fontSize: 30 }}>about</a>
          </Link>
        </div>
        <Component {...pageProps}></Component>
      </Spin>
    </I18nContext.Provider>
  );
};

export default connect((state: any) => {
  return {
    isLoading: helper.isLoading()
  };
})(Index);
