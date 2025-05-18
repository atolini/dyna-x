import { Key } from "./key";

export type UnprocessedItems<T> = Array<{ type: 'put' | 'delete'; item: T | Key }>; 
