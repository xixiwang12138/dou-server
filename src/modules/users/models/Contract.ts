import {BaseModel, JSONColumn} from "../../sequelize/BaseModel";
import {model} from "../../sequelize/SequelizeManager";
import {AllowNull, AutoIncrement, Column, DataType, PrimaryKey, Table, Unique} from "sequelize-typescript";
import {snowflakeModel} from "../../sequelize/snowflake/Snowflake";

export enum SignState {
    Sign = 1, // 签名
    Reject  = 2, // 拒绝
}

@model
@snowflakeModel
@Table({
    freezeTableName: true,
    timestamps: true,
    modelName: "contract",
})
export class Contract extends BaseModel {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: string;

    @AllowNull
    @Column(DataType.BIGINT)
    appId?: string; // 合约的应用（仅外部签名）

    @Column(DataType.STRING(64))
    name: string; // 合约名称

    @Unique
    @Column(DataType.STRING(64))
    address: string; // 合约地址

    @JSONColumn("long")
    abi: object; // 合约ABI

    @Column(DataType.TEXT)
    code: string; // 合约代码
}
