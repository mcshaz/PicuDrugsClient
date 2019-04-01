import { Container } from 'inversify';
import { TYPES } from './types';
import { IFetch } from './Injectables/IFetch';
import { ILogger } from './Injectables/ILogger';
import { IDrugDB } from './Injectables/IDrugDB';
import { DrugsDBLocal } from './injectableImplementations/DrugsLocalDb';
import { BrowserFetch } from './injectableImplementations/BrowserFetch';
import { EmptyLogger } from './injectableImplementations/EmptyLogger';


const drugDbContainer = new Container();
drugDbContainer.bind<IFetch>(TYPES.IFetch).to(BrowserFetch);
drugDbContainer.bind<ILogger>(TYPES.ILogger).to(EmptyLogger);
drugDbContainer.bind<IDrugDB>(TYPES.IDrugDB).to(DrugsDBLocal).inSingletonScope();
export  { drugDbContainer };