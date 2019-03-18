import { Container } from "inversify";
import { TYPES } from "./types";
import { IFetch } from "./Injectables/IFetch";
import { ILogger, EmptyLogger } from "./Injectables/ILogger";
import { IDrugDB } from "./Injectables/IDrugDB";
import { drugsDBLocal } from "./injectableImplementations/drugsLocalDb";
import { BrowserFetch } from "./injectableImplementations/WebWorkerFetch";


const drugDbContainer = new Container();
drugDbContainer.bind<IFetch>(TYPES.IFetch).to(BrowserFetch);
drugDbContainer.bind<ILogger>(TYPES.ILogger).to(EmptyLogger);
drugDbContainer.bind<IDrugDB>(TYPES.IDrugDB).to(drugsDBLocal).inSingletonScope();
export  { drugDbContainer }