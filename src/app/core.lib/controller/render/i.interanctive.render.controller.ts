import { IEntity } from "../../model/entity/i.entity";
import { IGeometry } from "../../model/geometry/i.geometry";
import { RGBA } from "../../model/other/color";

export interface IInteranctiveRenderController {
    /**
     * 背景色
     */
    BackColor: RGBA;

    /**
     * 前景色
     */
    ForeColor: RGBA;

    /**
     * 基础笔宽
     */
    BasePenWidth: number;

    /**
     * 宿主Canvas
     */
    HostCanvas?: HTMLCanvasElement;

    /**
     * 高亮实体集
     */
    HighlightEntities: IEntity[];

    /**
     * 交互几何集
     */
    InteranctiveGeometries: IGeometry[]

    /**
     * 宿主canvas标签元素
     */
    SetHostCanvas(canvas: HTMLCanvasElement): void;

    /**
     * 重置尺寸
     */
    Resize(width: number, height: number): void;

    /**
     * 绘制
     * @param entities 绘制的实体
     */
    Drawing(): void;

    /**
     * 刷新
     * @param entities 绘制的实体
     */
    Refresh(): void;

    /**
     * 清理
     */
    Clean(): void;
}