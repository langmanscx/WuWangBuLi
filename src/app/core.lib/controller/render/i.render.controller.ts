import { Observable } from "rxjs";
import { RGBA } from "../../model/other/color";
import { DataChangeInfo } from "../../service/data/data.service";

/**
 * 渲染接口
 */
export interface IRenderController {

    /**
     * x位移
     */
    Dx: number;

    /**
     * y位移
     */
    Dy: number;

    /**
     * z位移
     */
    Dz: number;

    /**
     * 缩放
     */
    Scale: number;

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
     * 刷新监听
     */
    RefreshObservable: Observable<boolean>;

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
     * @param info 数据的变化信息
     */
    Drawing(info?: DataChangeInfo): void;

    /**
     * 刷新
     * @param info 数据的变化信息
     */
    Refresh(info?: DataChangeInfo): void;

    /**
     * 清理
     * @param info 数据的变化信息
     */
    Clean(info?: DataChangeInfo): void;

}