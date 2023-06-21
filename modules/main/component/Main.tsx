import React from 'react';
import Link from 'next/link';
import { BaseModuleProps } from 'dist';

interface Props extends BaseModuleProps {
  isLoading: boolean;
}

export default function(props: Props) {
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