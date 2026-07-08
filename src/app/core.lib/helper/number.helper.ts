import { Arc2d } from "../model/geometry/line/arc2d";
import { Line2d } from "../model/geometry/line/line2d";
import { Point2d } from "../model/geometry/point/point2d";
import { Vertex2d } from "../model/geometry/point/vertex2d";

export function NumberParse(content: string): number[] {

    if (content.includes(',')) {
        const str = content.split(',');
        return str.map(x => numbersingleParse(x))
            .filter(x => x !== Number.NaN);
    }
    else {
        const num = numbersingleParse(content);
        return num === Number.NaN ? [] : [num];
    }
}

function numbersingleParse(content: string) {
    if (content.includes('.'))
        return parseFloat(content);
    else
        return parseInt(content);
}

export function RoundWithPrecision(num: number, precision: number): number {
    const n = 10 ** precision;
    return Math.round(num * n) / n;
}

export function EqualWithPrecision(num: number, other: number, precision: number): boolean {
    return RoundWithPrecision(num - other, precision) == 0;
}

export function PointEqual(point: Point2d, other: Point2d, precision: number): boolean {
    return EqualWithPrecision(point.X, other.X, precision)
        && EqualWithPrecision(point.Y, other.Y, precision);
}

export function VertexEqual(vertex: Vertex2d, other: Vertex2d, precision: number): boolean {
    return EqualWithPrecision(vertex.X, other.X, precision)
        && EqualWithPrecision(vertex.Y, other.Y, precision)
        && EqualWithPrecision(vertex.Bulge, other.Bulge, 2);
}

export function LineEqual(line: Line2d, other: Line2d, precision: number): boolean {
    const ff = PointEqual(line.From, other.From, precision);
    const ft = PointEqual(line.From, other.To, precision);
    const tf = PointEqual(line.To, other.From, precision);
    const tt = PointEqual(line.To, other.To, precision);

    return (ff && tt) || (ft && tf);
}

export function ArcEqual(arc: Arc2d, other: Arc2d, precision: number): boolean {
    const a = arc.GetVertexs();
    const oa = other.GetVertexs();
    const ra = other.GetReverse().GetVertexs();

    const fof = VertexEqual(a[0], oa[0], precision);
    const tot = VertexEqual(a[1], oa[1], precision);
    const frf = VertexEqual(a[0], ra[0], precision);
    const frt = VertexEqual(a[1], ra[1], precision);

    return (fof && tot) || (frf && frt);
}