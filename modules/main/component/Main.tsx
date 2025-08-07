import React from 'react';
import Link from 'next/link';
import { BaseModuleProps } from 'dist';

interface Props extends BaseModuleProps {
  isLoading: boolean;
}

export default function (props: Props) {
  const { Component, pageProps } = props;
  return (
    <div className='main'>
      <div>
        <Link href="/">
          /
        </Link>
        <Link href="/home">
          home
        </Link>
        &nbsp;&nbsp;
        <Link href="/about">
          about
        </Link>
      </div>
      <Component {...pageProps} />
    </div>
  );
};