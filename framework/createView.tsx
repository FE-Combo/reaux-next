import React from 'react';
import { BaseModel } from './type';
import { NextPageContext } from 'next';

/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
export function createView<H extends BaseModel>(
  handler: H,
  Component: React.ComponentType<any>,
): React.ComponentType<any> & {
  getInitialProps?: (context: NextPageContext) => any;
} {
  return class View<P extends {} = {}> extends React.PureComponent<P> {
    async componentDidMount() {
      await handler.onLoad();
    }

    async componentDidUpdate() {
      await handler.onUpdate();
    }

    async componentWillUnmount() {
      await handler.onUnload();
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}
