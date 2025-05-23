/**
 * Configuration for a key field used in database operations.
 * Specifies the key's name and its expected primitive type.
 *
 * @property {string} name - The name of the key field. Typically used as partition or sort key.
 * @property {'string' | 'number'} type - The expected primitive type of the key. Must be 'string' or 'number'.
 */
export interface KeyConfig {
  /** The name of the key field. Typically used as partition or sort key. */
  name: string;

  /** The expected primitive type of the key. Must be 'string' or 'number'. */
  type: 'string' | 'number';
}
