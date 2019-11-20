import React from "react";
import { BaseModel } from "./type";

/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
export function createView<H extends BaseModel>(
  handler: H,
  Component: React.ComponentType<any>
): React.ComponentType<any> & {
  getInitialProps: (context: any) => any;
} {
  return class View<P extends {} = {}> extends React.PureComponent<P> {
    static async getInitialProps(context: any) {
      return (await handler.onReady()) || {};
    }

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
