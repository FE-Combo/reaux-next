import { AnyAction } from "redux";
import { AppCache, Exception, HelperActionPayload } from "./type";
declare type SetHelperAction = <T>(type: T, payload: HelperActionPayload) => any;
export declare class Helper {
    appCache: AppCache;
    setHelperAction: SetHelperAction;
    constructor(appCache: AppCache, setHelperAction: SetHelperAction);
    put<T extends AnyAction>(action: T): void;
    loading(identifier?: string): (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => TypedPropertyDescriptor<(...args: any[]) => any>;
    isLoading(identifier: string): boolean;
    get lang(): string | undefined;
    set lang(value: string | undefined);
    get exception(): Exception | undefined;
    set exception(exception: Exception | undefined);
    delay(ms: number): Promise<void>;
}
export {};
