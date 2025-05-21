/**
 * @interface IUserEventLogger
 * @template T - The shape of user attributes used throughout the service.
 *
 * @description
 * Interface for logging all user-related events such as creation, update, and deletion.
 * Intended to provide observability and traceability for identity management operations.
 */
export interface IUserDirectoryServiceEventLogger<T> {
  /**
   * Logs a user creation event.
   *
   * @param userName - The username of the newly created user.
   * @param userAttributes - The attributes assigned to the user at creation.
   */
  userCreated(userName: string, userAttributes: T): void;

  /**
   * Logs a user update event.
   *
   * @param userName - The username of the user whose attributes were updated.
   * @param userAttributes - The updated user attributes.
   */
  userUpdated(userName: string, userAttributes: T): void;

  /**
   * Logs a user deletion event.
   *
   * @param userName - The username of the deleted user.
   */
  userDeleted(userName: string): void;
}
