import * as fs from 'fs';
import * as path from 'path';
import { IFileManager } from '../contracts';

/**
 * Manages file operations within a specified directory.
 */
export class FileManager implements IFileManager {
  private dir: string;

  /**
   * Initializes the FileManager with a given directory path.
   * If the directory does not exist, it is created.
   * @param relativePath - The relative path of the directory to manage.
   */
  constructor(relativePath: string) {
    this.dir = path.resolve(relativePath);

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  /**
   * Lists all files in the managed directory.
   * @returns An array containing the names of all files in the directory.
   */
  listFiles(): string[] {
    return fs.readdirSync(this.dir);
  }

  /**
   * Reads the content of a specified file.
   * @param fileName - The name of the file to read.
   * @returns The file content as a string, or `null` if the file does not exist.
   */
  readFile(fileName: string): string | null {
    const filePath = path.join(this.dir, fileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Writes content to a specified file. Creates the file if it does not exist.
   * @param fileName - The name of the file.
   * @param content - The content to write to the file.
   */
  writeFile(fileName: string, content: string): void {
    const filePath = path.join(this.dir, fileName);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Deletes a specified file if it exists.
   * @param fileName - The name of the file to delete.
   */
  deleteFile(fileName: string): void {
    const filePath = path.join(this.dir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
