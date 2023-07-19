import {BaseModel} from '@ioc:Adonis/Lucid/Orm';

import CamelCaseNamingStrategy from './strategies/CamelCaseNamingStrategy';

export default class AppBaseModel extends BaseModel {
  static namingStrategy = new CamelCaseNamingStrategy();
}
