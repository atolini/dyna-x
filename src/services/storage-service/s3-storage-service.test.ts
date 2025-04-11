import { mockClient } from 'aws-sdk-client-mock';
import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand, 
    ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { S3StorageService } from './s3-storage-service';
import { IStorageService } from './i-storage-service';

describe('S3StorageService', () => {
  const s3Mock = mockClient(S3Client);
  const bucketName = 'test-bucket';
  const region = 'us-east-1';
  let storageService: IStorageService;

  beforeEach(() => {
    s3Mock.reset();
    storageService = new S3StorageService(region, bucketName);
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const key = 'test.txt';
      const body = 'test content';
      const contentType = 'text/plain';

      s3Mock.on(PutObjectCommand).resolves({});

      await expect(storageService.uploadFile(key, body, contentType)).resolves.not.toThrow();
    });

    it('should throw error when upload fails', async () => {
      const key = 'test.txt';
      const body = 'test content';
      const contentType = 'text/plain';

      s3Mock.on(PutObjectCommand).rejects(new Error('Upload failed'));

      await expect(storageService.uploadFile(key, body, contentType)).rejects.toThrow('Upload failed');
    });
  });

  describe('getFile', () => {
    it('should retrieve file as Buffer', async () => {
      const key = 'test.txt';
      const fileContent = 'file content';
      const mockStream = Object.assign(
        new Readable({
          read() {
            this.push(fileContent);
            this.push(null); // EOF
          }
        }), 
        {
          transformToString: async () => fileContent
        }
      );

      s3Mock.on(GetObjectCommand).resolves({
        Body: mockStream as any
      });

      const result = await storageService.getFile(key);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toEqual(fileContent);
    });

    it('should throw error when file not found', async () => {
      const key = 'nonexistent.txt';

      s3Mock.on(GetObjectCommand).resolves({
        Body: undefined
      });

      await expect(storageService.getFile(key)).rejects.toThrow('File not found');
    });

    it('should throw error when retrieval fails', async () => {
      const key = 'test.txt';

      s3Mock.on(GetObjectCommand).rejects(new Error('Retrieval failed'));

      await expect(storageService.getFile(key)).rejects.toThrow('Retrieval failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const key = 'file-to-delete.txt';

      s3Mock.on(DeleteObjectCommand).resolves({});

      await expect(storageService.deleteFile(key)).resolves.not.toThrow();
    });

    it('should throw error when deletion fails', async () => {
      const key = 'file-to-delete.txt';

      s3Mock.on(DeleteObjectCommand).rejects(new Error('Deletion failed'));

      await expect(storageService.deleteFile(key)).rejects.toThrow('Deletion failed');
    });
  });

  describe('listFiles', () => {
    it('should return array of file keys', async () => {
      const mockFiles = [
        { Key: 'file1.txt' },
        { Key: 'file2.txt' },
        { Key: 'folder/file3.txt' }
      ];

      s3Mock.on(ListObjectsV2Command).resolves({
        Contents: mockFiles
      });

      const result = await storageService.listFiles();
      expect(result).toEqual(['file1.txt', 'file2.txt', 'folder/file3.txt']);
    });

    it('should return empty array when bucket is empty', async () => {
      s3Mock.on(ListObjectsV2Command).resolves({
        Contents: undefined
      });

      const result = await storageService.listFiles();
      expect(result).toEqual([]);
    });

    it('should throw error when listing fails', async () => {
      s3Mock.on(ListObjectsV2Command).rejects(new Error('Listing failed'));

      await expect(storageService.listFiles()).rejects.toThrow('Listing failed');
    });
  });
});