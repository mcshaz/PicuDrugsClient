import { ILogger } from './../Injectables/ILogger';

export class EmptyLogger implements ILogger {
    public debug(s: string): boolean {
        return true;
    }
    public error(s: string): boolean {
        return true;
    }
    public fatal(s: string): boolean {
        return true;
    }
    public information(s: string): boolean {
        return true;
    }
    public log(s: string): void {
        this.information(s);
    }

    public warning(s: string): boolean {
        return true;
    }
    public child(s: string): ILogger {
        return this;
    }
}
