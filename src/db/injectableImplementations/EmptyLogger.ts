import { ILogger } from "./../Injectables/ILogger";

export class EmptyLogger implements ILogger{
    debug(s: string): boolean {
        return true;
    }    
    error(s: string): boolean {
        return true;
    }
    fatal(s: string): boolean {
        return true;
    }
    information(s: string): boolean {
        return true;
    }
    log(s: string): void {
    }
    warning(s: string): boolean {
        return true;
    }
    child(s:string):ILogger{
        return this;
    }
}