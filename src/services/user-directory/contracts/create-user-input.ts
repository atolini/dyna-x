/**
 * @interface CreateUserInput
 * @template T - The shape of each user attribute.
 *
 * @description
 * Represents the input required to create a new user.
 *
 * @property {string} login - The user's login name (usually email or username).
 * @property {T[]} userAttributes - A list of user attributes to assign to the user.
 * @property {string} temporaryPassword - Optional temporary password to be assigned to the user.
 * @property {boolean} suppressMessage - If true, suppresses the automatic message sent to the user upon creation.
 */
export interface CreateUserInput<T> {
  /** The user's login name (usually email or username). */
  login: string;

  /** A list of user attributes to assign to the user. */
  userAttributes: T[];

  /** Optional temporary password to be assigned to the user. */
  temporaryPassword?: string;

  /** If true, suppresses the automatic message sent to the user upon creation. */
  suppressMessage?: boolean;
}
