import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { helper, BaseModuleProps } from 'dist';

interface Props extends BaseModuleProps {
  isLoading: boolean;
}

const Index = (props: Props) => {
  const { Component, pageProps } = props;
  return (
    <div>
      <div>
        <Link href="/">
          <a style={{ color: '#000', fontSize: 30 }}>/</a>
        </Link>
        <Link href="/home">
          <a style={{ color: '#000', fontSize: 30 }}>home</a>
        </Link>
        &nbsp;&nbsp;
        <Link href="/about">
          <a style={{ color: '#000', fontSize: 30 }}>about</a>
        </Link>
      </div>
      <Component {...pageProps} />
    </div>
  );
};

export default connect(() => {
  return {
    isLoading: helper.isLoading(),
  };
})(Index);
