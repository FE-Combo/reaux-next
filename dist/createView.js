"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
function createView(handler, Component) {
    return class View extends react_1.default.PureComponent {
        static async getInitialProps(context) {
            handler.resetState();
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
            return react_1.default.createElement(Component, Object.assign({}, this.props));
        }
    };
}
exports.createView = createView;
//# sourceMappingURL=createView.js.map