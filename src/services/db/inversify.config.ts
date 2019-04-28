import { Container, interfaces } from 'inversify';
import { TYPES } from './types';
import { IFetch } from './Injectables/IFetch';
import { ILogger } from './Injectables/ILogger';
import { IDrugDB } from './Injectables/IDrugDB';
import { DrugsDBLocal } from './injectableImplementations/DrugsDBLocal';
import { BrowserFetch } from './injectableImplementations/BrowserFetch';
// import { EmptyLogger } from './injectableImplementations/EmptyLogger';
import { ConsoleLogger } from './injectableImplementations/ConsoleLogger';
import { IAppData } from './Injectables/IAppData';
import { AppDataFromDexie } from './injectableImplementations/AppDataFromDb';


const drugDbContainer = new Container();
drugDbContainer.bind<IFetch>(TYPES.IFetch).to(BrowserFetch);
drugDbContainer.bind<ILogger>(TYPES.ILogger).to(ConsoleLogger);
drugDbContainer.bind<IDrugDB>(TYPES.IDrugDB).to(DrugsDBLocal).inSingletonScope();
drugDbContainer.bind<IAppData>(TYPES.IAppData).to(AppDataFromDexie);
export { drugDbContainer };
