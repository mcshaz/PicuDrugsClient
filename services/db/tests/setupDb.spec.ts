import { IEntityWard } from '../../../src/db/entities/IEntityWard';
import { EmptyLogger } from '@/db/injectableImplementations/EmptyLogger';
import { fileFetch } from './../../test_resources/FileFetch';
import { expect } from 'chai';
import { DrugsDBLocal } from '@/db/injectableImplementations/DrugsLocalDb';

describe('setup local db', () => {
    const db = new DrugsDBLocal(fileFetch, new EmptyLogger());
    let wards: IEntityWard[];
    before(async () => {
        wards = await db.wards.toArray();
    });
    describe('data added', () => {
        it('has wards added', () => {
            expect(wards).length.is.greaterThan(0);
        });
    });
    after(async () => {
        for (const r of [db.wards, db.bolusDrugs, db.defibModels, db.fixedDrugs, db.appData]) {
            await r.clear();
        }
    });
});
