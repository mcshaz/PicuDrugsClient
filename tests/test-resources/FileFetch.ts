import { IServerChanges, IFetch  } from '@/services/db';

const fileFetch: IFetch = {
    async getUpdates(lastServerCheckUtc: Date | null) {
        let fileName = './tests/test-resources/newdb.json';
        if (new Function('try {return this===global;}catch(e){return false;}')()) {
            const fs = await import('fs');
            const path = await import('path');
            fileName = path.resolve(fileName);
            const promise = new Promise((resolve, reject) => {
                fs.readFile(fileName, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(data.toString()));
                    }
                });
            });
            return promise as Promise<IServerChanges>;
        }
        // running in browser
        const response = await fetch(fileName);
        return response.json() as Promise<IServerChanges>;
    },
};
export { fileFetch };
