/**
 * Represents the input required to create a new user.
 * 
 * @template T - The shape of each user attribute.
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

/**
 * Represents the input required to update an existing user's attributes.
 * 
 * @template T - The shape of each user attribute.
 */
export interface UpdateUserAttributesInput<T> {
    /** The unique identifier of the user to update. */
    id: string;

    /** A list of updated user attributes. */
    userAttributes: T[];
}

/**
 * Represents the input required to delete a user.
 */
export interface DeleteUserInput {
    /** The unique identifier of the user to delete. */
    id: string;
}

/**
 * Interface for user service operations such as creating, updating, and deleting users.
 * 
 * @template T - The shape of user attributes used throughout the service.
 */
export interface IUserService<T> {
    /**
     * Creates a new user with the specified input.
     * 
     * @param input - The data required to create the user.
     */
    createUser(input: CreateUserInput<T>): Promise<void>;

    /**
     * Updates the attributes of an existing user.
     * 
     * @param input - The data required to update the user.
     */
    updateUserAttributes(input: UpdateUserAttributesInput<T>): Promise<void>;

    /**
     * Deletes a user by their unique identifier.
     * 
     * @param input - The data required to delete the user.
     */
    deleteUser(input: DeleteUserInput): Promise<void>;
}