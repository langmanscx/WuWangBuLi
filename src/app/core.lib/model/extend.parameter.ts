import { DataExtendParameter } from "./data/data.extend.parameter";

/**
 * 数据的扩展参数
 */
export class ExtendParameter {
    public Key!: string;
    public Value: any;

    public Convert(): DataExtendParameter {
        
        const result: DataExtendParameter = {
            Key: this.Key,
            Value: this.Value
        };
        return result;
    }
}