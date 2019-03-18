import { tableName } from "./enums/tableNames";

interface IDeletionDate {
    table:tableName;
    lastDeletion: Date;
}

export {IDeletionDate}