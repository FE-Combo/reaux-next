import { createContext, useContext } from "react";
import EN from "../locales/en";
import ZH from "../locales/zh";

export const locales = {
  EN,
  ZH
};

const initLocales: typeof ZH | null = null;
export const AppLocales = createContext(initLocales);
export const LocalesProvider = AppLocales.Provider;
export const LocalesConsumer = AppLocales.Consumer;
export function useLocales() {
  return useContext(AppLocales);
}
