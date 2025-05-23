import { CreateUserInput, DeleteUserInput, UpdateUserAttributesInput } from '.';

/**
 * @template T - The shape of user attributes used throughout the service.
 *
 * @description
 * Interface for user service operations such as creating, updating, and deleting users.
 */
export interface IUserDirectoryService<T> {
  /**
   * Creates a new user with the specified input.
   *
   * @param input - The data required to create the user.
   * @returns A promise that resolves when the user is created.
   */
  createUser(input: CreateUserInput<T>): Promise<void>;

  /**
   * Updates the attributes of an existing user.
   *
   * @param input - The data required to update the user.
   * @returns A promise that resolves when the user attributes are updated.
   */
  updateUserAttributes(input: UpdateUserAttributesInput<T>): Promise<void>;

  /**
   * Deletes a user by their unique identifier.
   *
   * @param input - The data required to delete the user.
   * @returns A promise that resolves when the user is deleted.
   */
  deleteUser(input: DeleteUserInput): Promise<void>;
}
