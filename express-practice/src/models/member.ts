import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';
import { injectable } from 'inversify';
import { Account } from './account';

export type MemberAttributes = {
  id: number;
  name: string;
  age?: number;
};

export type MemberCreationAttributes = Optional<MemberAttributes, 'id'>;

@injectable()
export class Member extends Model<MemberAttributes, MemberCreationAttributes> {
  declare id: number;
  declare name: string;
  declare age: number | null;
  declare accounts?: Account[];

  declare getAccounts: () => Promise<Account[]>;

  async destroyAccounts() {
    const accounts = this.accounts ?? (await this.getAccounts());
    return Promise.all(accounts.map((account) => account.destroy()));
  }
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'member',
    timestamps: true,
    paranoid: true,
  }
);
