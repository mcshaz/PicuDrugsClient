import { tableName } from '../entities/enums/tableNames';

export interface INewServerDeletions {
    table: tableName;
    deletionIds: number[];
}
