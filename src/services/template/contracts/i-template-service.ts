/**
 * This interface defines a contract for template creation.
 *
 * The implementation of this interface is responsible for compiling templates at runtime.
 * It is used to generate dynamic HTML or text from provided data, for example, to create emails, reports,
 * or any other type of document that requires dynamic formatting.
 */
export interface ITemplateService {
  /**
   * Compiles the template with the provided data.
   * This method takes a set of data and injects it into the template to generate the final output.
   *
   * @param data - An object containing the values to inject into the template. The object keys represent
   *               the placeholders in the template, and the values are the data to be inserted.
   * @returns {string} The resulting string after compiling the template with the provided data.
   *                  This could be an HTML string, a plain text document, or other types of formatted output.
   */
  compile(data: Record<string, any>): string;
}
