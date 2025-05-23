/**
 * Represents token credentials used for token-based authorization.
 *
 * The access token and identity token are required when using AWS Verified Permissions
 * with token-based authorization.
 *
 * These tokens should be securely obtained from an identity provider and passed to the service
 * when creating an instance of {@link AVPAuthorizationService}.
 *
 * @example
 * const token: Token = {
 *   accessToken: 'your-access-token',
 *   identityToken: 'your-identity-token',
 * };
 */
export type Token = {
  /**
   * The access token used for authenticating the principal.
   */
  accessToken: string;

  /**
   * The identity token used to identify the principal.
   */
  identityToken: string;
};
