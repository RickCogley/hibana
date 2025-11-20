// setup types - using any to avoid Lume type import issues
// deno-lint-ignore-file no-explicit-any
export type Site = any;
export type Page = any;
export function merge(...objects: any[]): any {
  return Object.assign({}, ...objects);
}
