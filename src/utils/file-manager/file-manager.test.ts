import * as fs from "fs";
import * as path from "path";
import { FileManager } from "./file-manager";

jest.mock("fs");

describe("FileManager", () => {
    const testDir = "test-directory";
    let fileManager: FileManager;

    beforeEach(() => {
        jest.clearAllMocks();
        fileManager = new FileManager(testDir);
    });

    test("should create the directory if it does not exist", () => {
        expect(fs.existsSync).toHaveBeenCalledWith(path.resolve(testDir));
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.resolve(testDir), { recursive: true });
    });

    test("should list files in the directory", () => {
        (fs.readdirSync as jest.Mock).mockReturnValue(["file1.txt", "file2.txt"]);
        const files = fileManager.listFiles();
        expect(files).toEqual(["file1.txt", "file2.txt"]);
    });

    test("should read file content if the file exists", () => {
        const filePath = path.join(path.resolve(testDir), "file.txt");
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue("File content");

        const content = fileManager.readFile("file.txt");
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, "utf-8");
        expect(content).toBe("File content");
    });

    test("should return null when reading a non-existing file", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const content = fileManager.readFile("non-existent.txt");
        expect(content).toBeNull();
    });

    test("should write content to a file", () => {
        const filePath = path.join(path.resolve(testDir), "file.txt");
        fileManager.writeFile("file.txt", "New content");

        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, "New content", "utf-8");
    });

    test("should delete a file if it exists", () => {
        const filePath = path.join(path.resolve(testDir), "file.txt");
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        fileManager.deleteFile("file.txt");
        expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
    });

    test("should not attempt to delete a non-existing file", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        fileManager.deleteFile("non-existent.txt");
        expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
});