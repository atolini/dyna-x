/**
 * Interface for logging template-related events.
 *
 * Provides methods to log the initialization and compilation of templates
 * in a structured and observable format.
 */
export interface ITemplateServiceEventLogger {
  /**
   * Logs the event of template initialization.
   *
   * @param templateString - The raw template string that was initialized.
   */
  templateInitialized(templateString: string): void;

  /**
   * Logs the event of template compilation with given data and result.
   *
   * @param data - The input data used during template compilation.
   * @param result - The resulting compiled template string.
   */
  templateCompiled(data: Record<string, any>, result: string): void;
}
