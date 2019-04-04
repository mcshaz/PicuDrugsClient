import { dbTableName } from '../entities/enums/tableNames';

export interface INewServerDeletions {
    table: dbTableName;
    deletionIds: number[];
}
