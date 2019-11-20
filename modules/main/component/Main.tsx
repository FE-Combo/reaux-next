import React from "react";
import Link from "next/link";

interface Props {
  Component: React.ComponentType<any>; // router component
  pageProps: {}; // router component props
}

const Index = (props: Props) => {
  const { Component, pageProps } = props;
  return (
    <div>
      <div>
        <Link href="/home">
          <a>home</a>
        </Link>
        &nbsp;&nbsp;
        <Link href="/about">
          <a>about</a>
        </Link>
      </div>
      <Component {...pageProps}></Component>
    </div>
  );
};

export default Index;
