/**
 * 拾取类型
 */
export enum PointPickType {
    /**
     * 未知
     */
    Unknown = 0,
    /**
     * 端点
     */
    End = 2 << 0,
    /**
     * 交点
     */
    Intersection = 2 << 1,
    /**
     * 垂足
     */
    FootPoint = 2 << 2,
    /**
     * 中点
     */
    MidPoint = 2 << 3,
    /**
     * 延长线的交点
     */
    ExtensionIntersection = 2 << 4,
    /**
     * 圆心
     */
    Center = 2 << 5,
}

export function GetSelectedPointPickTypes(value: number): PointPickType[] {
    const result: PointPickType[] = [];

    if (value & PointPickType.End) {
        result.push(PointPickType.End);
    }

    if (value & PointPickType.Intersection) {
        result.push(PointPickType.Intersection);
    }

    if (value & PointPickType.FootPoint) {
        result.push(PointPickType.FootPoint);
    }

    if (value & PointPickType.MidPoint) {
        result.push(PointPickType.MidPoint);
    }

    if (value & PointPickType.ExtensionIntersection) {
        result.push(PointPickType.ExtensionIntersection);
    }

    if (value & PointPickType.Center) {
        result.push(PointPickType.Center);
    }

    return result;
}