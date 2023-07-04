import {string} from '@ioc:Adonis/Core/Helpers';
import {BaseModel, SnakeCaseNamingStrategy} from '@ioc:Adonis/Lucid/Orm';

export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName);
  }
}
