import { IServerChanges } from '../services/db';
import { IFetch } from '../services/db';

const fileFetch: IFetch = {
    async getUpdates(lastServerCheckUtc: Date | null) {
        const response = await fetch('./newdb.json');
        return response.json() as Promise<IServerChanges>;
    },
};
export { fileFetch };
