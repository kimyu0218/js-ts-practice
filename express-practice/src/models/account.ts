import { DataTypes, Model, Optional, Association, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../database';
import { injectable } from 'inversify';
import { Member } from './member';

export type AccountAttributes = {
  id: number;
  memberId: number;
};

export type AccountCreationAttributes = Optional<AccountAttributes, 'id'>;

@injectable()
export class Account extends Model<AccountAttributes, AccountCreationAttributes> {
  declare id: number;
  declare memberId: number;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'account',
    timestamps: true,
    paranoid: true,
  }
);

Member.hasMany(Account, { foreignKey: 'memberId', as: 'accounts' });
Account.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
