import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILogger } from '../Injectables/ILogger';

@injectable()
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
    public info(s: string): boolean {
        return true;
    }
    public log(s: string): void {
        this.info(s);
    }

    public warn(s: string): boolean {
        return true;
    }
    public child(s: string): ILogger {
        return this;
    }
}
