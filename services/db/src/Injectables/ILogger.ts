export interface ILogger {
    debug(s: string): boolean;
    error(s: string): boolean;
    fatal(s: string): boolean;
    information(s: string): boolean;
    log(s: string): void;
    warning(s: string): boolean;
    child(s: string): ILogger;
}
