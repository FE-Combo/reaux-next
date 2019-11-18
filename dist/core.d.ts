import React, { ComponentType } from "react";
import { StateView, BaseModel } from "./type";
import { Helper } from "./helper";
declare const helper: Helper;
declare function start(Component: ComponentType<any> & {
    getInitialProps: (context: any) => void;
}): {
    new (props: Readonly<{}>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: {}, context?: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<{}> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<{}>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void;
    };
    getInitialProps(context: any): Promise<{
        appProps: void | {};
    }>;
    contextType?: React.Context<any>;
};
declare function register<H extends BaseModel>(handler: H, Component: ComponentType<any>): {
    View: {
        new <P extends {} = {}>(props: Readonly<P>): {
            componentDidMount(): void;
            componentDidUpdate(): void;
            componentWillUnmount(): void;
            render(): JSX.Element;
            context: any;
            setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<P> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<{}>, nextContext: any): void;
        };
        new <P_1 extends {} = {}>(props: P_1, context?: any): {
            componentDidMount(): void;
            componentDidUpdate(): void;
            componentWillUnmount(): void;
            render(): JSX.Element;
            context: any;
            setState<K_1 extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P_1>) => {} | Pick<{}, K_1>) | Pick<{}, K_1>, callback?: () => void): void;
            forceUpdate(callback?: () => void): void;
            readonly props: Readonly<P_1> & Readonly<{
                children?: React.ReactNode;
            }>;
            state: Readonly<{}>;
            refs: {
                [key: string]: React.ReactInstance;
            };
            shouldComponentUpdate?(nextProps: Readonly<P_1>, nextState: Readonly<{}>, nextContext: any): boolean;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<P_1>, prevState: Readonly<{}>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<P_1>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P_1>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<P_1>, nextState: Readonly<{}>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<P_1>, nextState: Readonly<{}>, nextContext: any): void;
        };
        getInitialProps(context: any): Promise<void>;
        contextType?: React.Context<any>;
    };
    actions: { readonly [K_3 in { [K_2 in keyof H]: H[K_2] extends (...args: any[]) => any ? K_2 : never; }[keyof H]]: H[K_3] extends (...args: infer P_2) => any ? (...args: P_2) => import("./type").ActionType<P_2> : never; };
};
declare class Model<S> extends BaseModel<S> {
    readonly moduleName: string;
    readonly initState: S;
    constructor(moduleName: string, initState: S);
    get state(): Readonly<S>;
    get rootState(): Readonly<StateView>;
    setState(newState: Partial<S>): void;
}
export { start, register, Model, helper };
