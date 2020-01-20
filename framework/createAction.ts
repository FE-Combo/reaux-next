import { ActionType } from "./type";

type ActionCreators<H> = {
  readonly [K in {
    [K in keyof H]: H[K] extends (...args: any[]) => any ? K : never;
  }[keyof H]]: H[K] extends (...args: infer P) => any
    ? (...args: P) => ActionType<P>
    : never;
};

interface ActionHandlers {
  [key: string]: (...args: any[]) => any;
}

function createActionHandlerType(
  moduleName: string,
  ActionHandlerType: string
) {
  return `@@framework/actionsHandler(${moduleName}=>${ActionHandlerType})`;
}

/**
 * According handler propertyNames generate actions and actionHandlers
 * @param handler Module reference. e.g: const handler = new Module("name",{})
 */
export function createAction<H extends object & { moduleName: string }>(
  handler: H
) {
  const moduleName = handler.moduleName;
  const keys = getPrototypeOfExceptConstructor(handler);
  const actions = {} as ActionCreators<H>;
  const actionHandlers = {} as ActionHandlers;
  keys.forEach(actionType => {
    const method = handler[actionType];
    const qualifiedActionType = createActionHandlerType(moduleName, actionType);
    actions[actionType] = (...payload: any[]) => ({
      type: qualifiedActionType,
      payload
    });
    actionHandlers[qualifiedActionType] = method.bind(handler);
  });

  return { actions, actionHandlers };
}

function getPrototypeOfExceptConstructor(object: object): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(object)).filter(
    key => key !== "constructor"
  );
}
