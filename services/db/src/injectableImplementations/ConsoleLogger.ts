import { ILogger } from './../Injectables/ILogger';

export class ConsoleLogger implements ILogger {
    private readonly pConsole = console;
    public debug(s: string): boolean {
        this.pConsole.log('debug: ' + s);
        return true;
    }
    public error(s: string): boolean {
        this.pConsole.log('error: ' + s);
        return true;
    }
    public fatal(s: string): boolean {
        this.pConsole.log('fatal: ' + s);
        return true;
    }
    public info(s: string): boolean {
        this.pConsole.log('info: ' + s);
        return true;
    }
    public log(s: string): void {
        this.pConsole.log('info: ' + s);
    }
    public warn(s: string): boolean {
        this.pConsole.log('warn: ' + s);
        return true;
    }
    public child(s: string): ILogger {
        throw new Error('Method not implemented.');
    }
}