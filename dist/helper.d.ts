import { AnyAction } from "redux";
import { AppCache } from "./type";
export declare class Helper {
    appCache: AppCache;
    constructor(appCache: AppCache);
    put<T extends AnyAction>(action: T): void;
    loading(identifier?: string): (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => TypedPropertyDescriptor<(...args: any[]) => any>;
    isLoading(identifier?: string): boolean;
    delay(ms: number): Promise<void>;
}
