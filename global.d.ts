/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      i18n: React.DetailedHTMLProps<any, any>;
    }
  }
}

type I18NOptions =
  | {
    namespace?: string;
    language?: string;
    [key: string]: string;
  }
  | string;

declare const i18n: (value: string, options?: I18NOptions) => any;
