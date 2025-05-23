/**
 * @template T - The shape of each user attribute.
 *
 * Represents the input required to update an existing user's attributes.
 *
 * @property {string} id - The unique identifier of the user to update.
 * @property {T[]} userAttributes - A list of updated user attributes.
 */
export interface UpdateUserAttributesInput<T> {
  /** The unique identifier of the user to update. */
  id: string;

  /** A list of updated user attributes. */
  userAttributes: T[];
}
