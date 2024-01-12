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
    modelName: "sign",
})
export class Sign extends BaseModel {
    @PrimaryKey
    @Column(DataType.BIGINT)
    id!: string;

    @Column(DataType.BIGINT)
    creator: string; // 签名者ID

    @Column(DataType.STRING(64))
    address: string; // 签名的地址

    @Column(DataType.TEXT)
    message: string; // 签名的消息

    @Column(DataType.TEXT)
    sign: string; // 签名

    @AllowNull
    @Column(DataType.BIGINT)
    appId?: string; // 签名的应用（仅外部签名）

    @Column(DataType.STRING(255))
    redirectUrl?: string; // 签名成功后的跳转地址（仅外部签名）

    @Column(DataType.INTEGER)
    signState: SignState; // 签名的类型
}
