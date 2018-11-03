//title: "오늘의 할일", content: "내일의 할일", done: false, deadline: "2018-11-05", priority: 5

module.exports = (sequelize, DataTypes) => {
    const list = sequelize.define('List', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        title: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notNull(val) {
                    if(!val) {
                        throw new Error('title이 입력되지 않았습니다.');
                    }
                }
            }
        },
        content: {
            type: DataTypes.TEXT,
            validate: {
                notNull: true,
                notNull(val) {
                    if(!val) {
                        throw new Error('content가 입력되지 않았습니다.');
                    }
                }
            }
        },
        done: {
            type: DataTypes.BOOLEAN,
            validate: {
                notNull: true,
                notNull(val) {
                    if(typeof val !== 'boolean') {
                        throw new Error('done이 입력되지 않았습니다.');
                    }
                }
            }
        },
        deadline: {
            type: DataTypes.DATEONLY
        },
        priority: {
            type: DataTypes.INTEGER,
            validate: {
                notNull: true,
                notNull(val) {
                    if(!val) {
                        throw new Error('priority가 입력되지 않았습니다.');
                    }
                }
            }
        }
    }, {
      // don't use camelcase for automatically added attributes but underscore style
      // so updatedAt will be updated_at
      underscored: true,
  
      // disable the modification of tablenames; By default, sequelize will automatically
      // transform all passed model names (first parameter of define) into plural.
      // if you don't want that, set the following
      freezeTableName: true,
  
      // define the table's name
      tableName: 'list',

      timestamps: false
    });
  
    return list;
  };
  
