import React from "react";
import { BaseModel } from "./type";
/**
 * Create Component and proxy component lifecycle
 * @param handler
 * @param Component
 */
export declare function createView<H extends BaseModel>(handler: H, Component: React.ComponentType<any>): React.ComponentType<any> & {
    getInitialProps: (context: any) => any;
};
