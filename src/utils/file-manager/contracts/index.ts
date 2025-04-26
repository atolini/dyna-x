/**
 * Interface for file management operations.
 */
export interface IFileManager {
  /**
   * Lists all available files.
   * @returns An array of file names.
   */
  listFiles(): string[];

  /**
   * Reads the content of a specified file.
   * @param fileName - The name of the file to read.
   * @returns The content of the file as a string.
   */
  readFile(fileName: string): string;

  /**
   * Writes content to a specified file.
   * @param fileName - The name of the file to write to.
   * @param content - The content to be written into the file.
   */
  writeFile(fileName: string, content: string): void;

  /**
   * Deletes a specified file.
   * @param fileName - The name of the file to delete.
   */
  deleteFile(fileName: string): void;
}
