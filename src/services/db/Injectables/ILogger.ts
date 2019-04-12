export interface ILogger {
    debug(s: string): boolean;
    error(s: string): boolean;
    fatal(s: string): boolean;
    info(s: string): boolean;
    log(s: string): void;
    warn(s: string): boolean;
    child(s: string): ILogger;
}
