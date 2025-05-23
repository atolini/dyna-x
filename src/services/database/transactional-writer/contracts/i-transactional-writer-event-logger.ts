import { ITransactionalWriterUnit } from '@database/transactional-writer/contracts';

/**
 * Defines a contract for logging events related to transactional writer operations,
 * such as successful writes.
 *
 * @template S - The schema type.
 * @template I - The item type.
 */
export interface ITransactionalWriterEventLogger<S = unknown, I = unknown> {
  /**
   * Logs the successful completion of a transactional write.
   *
   * @param units - The write units that were successfully written.
   */
  transactionSucceeded(units: ITransactionalWriterUnit<S, I>[]): void;
}
