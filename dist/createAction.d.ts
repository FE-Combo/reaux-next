import { ActionType } from "./type";
declare type ActionCreators<H> = {
    readonly [K in {
        [K in keyof H]: H[K] extends (...args: any[]) => any ? K : never;
    }[keyof H]]: H[K] extends (...args: infer P) => any ? ((...args: P) => ActionType<P>) : never;
};
interface ActionHandlers {
    [key: string]: (...args: any[]) => any;
}
/**
 * According handler propertyNames generate actions and actionHandlers
 * @param handler Module reference. e.g: const handler = new Module("name",{})
 */
export declare function createAction<H extends object & {
    moduleName: string;
}>(handler: H): {
    actions: ActionCreators<H>;
    actionHandlers: ActionHandlers;
};
export {};
