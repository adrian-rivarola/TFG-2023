import { DataSource } from 'typeorm';

import { DB_ENTITIES, DB_SUBSCRIBERS } from '../../data';

export function initiMemoryDB() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    logging: false,
    synchronize: true,
    entities: DB_ENTITIES,
    subscribers: DB_SUBSCRIBERS,
  });

  return dataSource.initialize();
}
