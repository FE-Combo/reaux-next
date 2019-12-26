import React from "react";
import { Spin, Icon } from "antd";
import { connect } from "react-redux";
import Link from "next/link";
import { helper } from "../../../framework";
import { LocalesProvider, locales } from "../../../utils/locales";
import "antd/dist/antd.css";

interface Props {
  lang: string;
  isLoading: boolean;
  Component: React.ComponentType<any>; // router component
  pageProps: object; // router component props
}

const Index = (props: Props) => {
  const { isLoading, Component, pageProps, lang } = props;
  return (
    <Spin
      spinning={isLoading}
      indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
    >
      <LocalesProvider value={locales[lang]}>
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
      </LocalesProvider>
    </Spin>
  );
};

export default connect((state: any) => {
  return {
    isLoading: helper.isLoading(),
    lang: helper.lang
  };
})(Index);
