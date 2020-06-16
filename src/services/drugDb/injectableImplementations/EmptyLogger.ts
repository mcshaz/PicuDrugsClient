import 'reflect-metadata';
import { injectable } from 'inversify';
import { ILogger } from '../Injectables/ILogger';

@injectable()
export class EmptyLogger implements ILogger {
  public debug(): boolean {
    return true;
  }

  public error(): boolean {
    return true;
  }

  public fatal(): boolean {
    return true;
  }

  public info(): boolean {
    return true;
  }

  public log(): void {
    this.info();
  }

  public warn(): boolean {
    return true;
  }

  public child(_s: string): ILogger {
    return this;
  }
}
