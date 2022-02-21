import React from "react";
import { BaseModel} from "./type";
import {AppContext} from "next/dist/pages/_app";

/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
export function createView<H extends BaseModel>(
  handler: H,
  Component: React.ComponentType<any>
): React.ComponentType<any> & {
  getInitialProps?: (context: AppContext) => any;
} {
  return class View<P extends {} = {}> extends React.PureComponent<P> {
    componentDidMount() {
      handler.onLoad();
    }

    componentDidUpdate() {
      handler.onLoad();
    }

    componentWillUnmount() {
      handler.onUnload();
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}