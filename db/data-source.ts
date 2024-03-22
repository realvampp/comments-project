import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension'
import {getSaveEnv} from "../src/common/utils";

dotenv.config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: getSaveEnv('MYSQL_HOST'),
  port: +getSaveEnv('MYSQL_PORT'),
  username: getSaveEnv('MYSQL_USER'),
  password: getSaveEnv('MYSQL_PASSWORD'),
  database: getSaveEnv('MYSQL_DATABASE'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],

  seeds: ['dist/db/seeds/**/*.js'],
  seedTracking: false,
  factories: ['dist/db/factories/**/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource