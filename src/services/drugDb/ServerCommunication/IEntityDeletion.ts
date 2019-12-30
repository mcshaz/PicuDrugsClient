import { dbTableName } from '../entities/enums/dbTableName'

export interface INewServerDeletions {
    table: dbTableName;
    deletionIds: number[];
}
