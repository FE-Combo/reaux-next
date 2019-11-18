import React from "react";
/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
export function createView(handler, Component) {
    return class View extends React.PureComponent {
        static async getInitialProps(context) {
            return await handler.onReady(context);
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
            return React.createElement(Component, Object.assign({}, this.props));
        }
    };
}
//# sourceMappingURL=createView.js.map