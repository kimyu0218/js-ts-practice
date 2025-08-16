import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';
import { injectable } from 'inversify';
import { Member } from './member';
import { bcryptHash } from '../utils/hash';

export type AccountAttributes = {
  id: number;
  memberId: number;
  password: string;
};

export type AccountCreationAttributes = Optional<AccountAttributes, 'id'>;

@injectable()
export class Account extends Model<AccountAttributes, AccountCreationAttributes> {
  declare id: number;
  declare memberId: number;
  declare password: string;
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        if (value.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const hash = bcryptHash(value);
        this.setDataValue('password', hash);
      },
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
Member.addScope('withAccounts', {
  include: [{ model: Account, as: 'accounts', required: true }],
});
Account.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
