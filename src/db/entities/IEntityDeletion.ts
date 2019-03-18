import { tableName } from "./enums/tableNames";

export interface IEntityDeletion{
    Id:number
    Table:tableName,
    DeletionDate:Date
}