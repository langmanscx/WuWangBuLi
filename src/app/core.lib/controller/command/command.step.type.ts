/**
 * 命令步骤类型
 */
export enum CommandStepType {
    /**
     * 未知
     */
    Unknown = 0,
    /**
     * 枚举1-9
     */
    Type = 1,
    /**
     * 数字
     */
    Number = 2,
    /**
     * 点
     */
    Point = 3,
    /**
     * 实体
     */
    Entity = 4,
}