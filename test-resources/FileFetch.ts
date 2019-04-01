import { IServerChanges } from '@/db/ServerCommunication/IServerChanges';
import { IFetch } from '@/db/Injectables/IFetch';

const fileFetch: IFetch = {
    async getUpdates(lastServerCheckUtc: Date | null) {
        const response = await fetch('./newdb.json');
        return response.json() as Promise<IServerChanges>;
    },
};
export { fileFetch };
