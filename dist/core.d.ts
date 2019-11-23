import React, { ComponentClass, ComponentType } from "react";
import { StateView, BaseModel } from "./type";
import { Helper } from "./helper";
declare const helper: Helper;
declare function start(Component: ComponentType<any> & {
    getInitialProps: (context: any) => any;
}, BaseApp: ComponentClass<any>): ComponentType<any> & {
    getInitialProps: (context: any) => any;
};
declare function register<H extends BaseModel>(handler: H, Component: ComponentType<any>): {
    View: (React.ComponentClass<any, any> & {
        getInitialProps: (context: any) => any;
    }) | (React.FunctionComponent<any> & {
        getInitialProps: (context: any) => any;
    });
    actions: { readonly [K_1 in { [K in keyof H]: H[K] extends (...args: any[]) => any ? K : never; }[keyof H]]: H[K_1] extends (...args: infer P) => any ? (...args: P) => import("./type").ActionType<P> : never; };
};
declare class Model<S> extends BaseModel<S> {
    readonly moduleName: string;
    readonly initState: S;
    constructor(moduleName: string, initState: S);
    get context(): Readonly<any>;
    get state(): Readonly<S>;
    get rootState(): Readonly<StateView>;
    setState(newState: Partial<S>): void;
    resetState(): void;
}
export { start, register, Model, helper };
