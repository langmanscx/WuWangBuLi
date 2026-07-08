import { Vector2d } from "../../model/math/vector/vector2d";
import { Point2d } from "../../model/geometry/point/point2d";

/**
 * 相机控制器接口
 */
export interface ICameraController2d {

    /**
     * 平移
     * @param from 起点
     * @param to 终止点
     * @param isKey 是否是键盘发出的指令
     */
    OnTranslate(from: Point2d, to: Point2d, isKey?: boolean): void;

    /**
     * 平移
     * @param vector 方向向量
     * @param isKey 是否是键盘发出的指令
     */
    OnTranslate(vector: Vector2d, isKey?: boolean): void;

    /**
     * 旋转
     * @param from 起点
     * @param to 终止点
     */
    OnRotate(from: Point2d, to: Point2d): void;

    /**
     * 旋转
     * @param vector 方向向量
     */
    OnRotate(vector: Vector2d): void;

    /**
     * 缩放
     * @param center 缩放中心
     * @param value 缩放数值
     */
    OnZoom(center: Point2d, value: number): void;
}