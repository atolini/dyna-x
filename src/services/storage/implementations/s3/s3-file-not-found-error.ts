export class S3FileNotFoundError extends Error {
  public readonly key: string;

  constructor(key: string) {
    super(`File not found in S3: ${key}`);
    this.name = "S3FileNotFoundError";
    this.key = key;
  }
}