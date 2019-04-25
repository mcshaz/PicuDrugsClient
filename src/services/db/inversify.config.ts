import { Container } from 'inversify';
import { TYPES } from './types';
import { IFetch } from './Injectables/IFetch';
import { ILogger } from './Injectables/ILogger';
import { IDrugDB } from './Injectables/IDrugDB';
import { DrugsDBLocal } from './injectableImplementations/DrugsDBLocal';
import { BrowserFetch } from './injectableImplementations/BrowserFetch';
// import { EmptyLogger } from './injectableImplementations/EmptyLogger';
import { ConsoleLogger } from './injectableImplementations/ConsoleLogger';


const drugDbContainer = new Container();
drugDbContainer.bind<IFetch>(TYPES.IFetch).to(BrowserFetch);
drugDbContainer.bind<ILogger>(TYPES.ILogger).to(ConsoleLogger);
drugDbContainer.bind<IDrugDB>(TYPES.IDrugDB).to(DrugsDBLocal).inSingletonScope();
export { drugDbContainer };
