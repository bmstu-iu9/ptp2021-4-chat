const PostgresQueryGenerator = require('sequelize/lib/dialects/postgres/query-generator')

/*
*
* Исправление ситуации, когда при синхронизации с настройкой alter: true
* и наличием в моделях столбцов с типом ENUM происходит ошибка.
* Код взят отсюда:
* https://github.com/sequelize/sequelize/issues/7649#issuecomment-595365422
*
*/
PostgresQueryGenerator.prototype.pgEnum = function(tableName, attr, dataType, options) {
  const enumName = this.pgEnumName(tableName, attr, options)
  let values

  if (dataType.values) {
    values = `ENUM(${dataType.values.map(value => this.escape(value)).join(', ')})`
  } else {
    values = dataType.toString().match(/^ENUM\(.+\)/)[0]
  }

  let sql = `DO $$ BEGIN IF NOT EXISTS` +
    ` (SELECT 1 FROM pg_type WHERE typname = 'enum_${tableName}_${attr}')` +
    ` THEN CREATE TYPE ${enumName} AS ${values}; END IF; END$$;`

  if (!!options && options.force === true) {
    sql = this.pgEnumDrop(tableName, attr) + sql
  }

  return sql
}
