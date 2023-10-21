import * as pg from 'pg';
/**
 * TODO: create a more specific type for OrderBy.
 * It looks like this (example):
 * [
 *   {id: -1},  // by id descending
 *   {name: 1}, // then by name ascending
 * ]
 */
type Data = Record<string, any>;
type Params = Array<any>;
export type WhereRaw = Record<string, any>;
export type OrderBy = Array<Record<string, 1 | -1>>;
export interface Limit {
    offset: number;
    limit: number;
}
interface Where {
    sql: string;
    values: Array<any>;
    $i: number;
}
type Row = Record<string, unknown>;
declare class Db {
    dbh: pg.Client;
    inTransaction: boolean;
    constructor(connectString: string);
    connect(): Promise<void>;
    close(): Promise<void>;
    patch(pathToPatchesDir: string, verbose?: boolean): Promise<void>;
    _buildWhere(where: WhereRaw, $i?: number): Where;
    _buildOrderBy(orderBy: OrderBy): string;
    _buildLimit(limit: Limit): string;
    _get<T extends Row>(query: string, params?: Params): Promise<T | null>;
    txn<T>(fn: () => Promise<T>): Promise<Awaited<T> | null>;
    run(query: string, params?: Params): Promise<pg.QueryResult>;
    _getMany<T>(query: string, params?: Params): Promise<T[]>;
    get<T extends Row>(table: string, whereRaw?: WhereRaw, orderBy?: OrderBy): Promise<T | null>;
    getMany<T>(table: string, whereRaw?: WhereRaw, orderBy?: OrderBy, limit?: Limit): Promise<T[]>;
    count(table: string, whereRaw?: WhereRaw): Promise<number>;
    delete(table: string, whereRaw?: WhereRaw): Promise<pg.QueryResult>;
    exists(table: string, whereRaw: WhereRaw): Promise<boolean>;
    upsert<T extends Data>(table: string, data: T, check: WhereRaw, idcol?: string | null): Promise<any>;
    insert<T extends Data>(table: string, data: T, idcol?: string | null): Promise<number | bigint>;
    update(table: string, data: Data, whereRaw?: WhereRaw): Promise<void>;
}
export default Db;
