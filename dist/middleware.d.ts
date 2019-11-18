import { Middleware } from "redux";
import { AppCache, Exception } from "./type";
declare type ErrorCallback = (exception: Exception) => void;
interface AsyncMiddleware extends Middleware {
    run: (app: AppCache, errorCallback: ErrorCallback) => void;
}
export declare function createPromiseMiddleware(): AsyncMiddleware;
export declare const asyncMiddleware: AsyncMiddleware;
export {};
