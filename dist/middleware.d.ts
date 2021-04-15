import { Middleware } from "redux";
import { AppCache } from "./type";
interface AsyncMiddleware extends Middleware {
    run: (app: AppCache) => void;
}
export declare function createPromiseMiddleware(): AsyncMiddleware;
export declare const asyncMiddleware: AsyncMiddleware;
export {};
