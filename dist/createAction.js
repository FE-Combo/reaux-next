/**
 * According handler propertyNames generate actions and actionHandlers
 * @param handler Module reference. e.g: const handler = new Module("name",{})
 */
export function createAction(handler) {
    const moduleName = handler.moduleName;
    const keys = getPrototypeOfExceptConstructor(handler);
    const actions = {};
    const actionHandlers = {};
    keys.forEach(actionType => {
        const method = handler[actionType];
        const qualifiedActionType = `${moduleName}/${actionType}`;
        actions[actionType] = (...payload) => ({
            type: qualifiedActionType,
            payload
        });
        actionHandlers[qualifiedActionType] = method.bind(handler);
    });
    return { actions, actionHandlers };
}
function getPrototypeOfExceptConstructor(object) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(object)).filter(key => key !== "constructor");
}
//# sourceMappingURL=createAction.js.map