import { Arc2d } from "../model/geometry/line/arc2d";
import { Curve2d } from "../model/geometry/line/curve2d";
import { Line2d } from "../model/geometry/line/line2d";
import { Point2d } from "../model/geometry/point/point2d";
import { IntersectionHelper } from "./intersection.helper";
import { ArcEqual, EqualWithPrecision, LineEqual } from "./number.helper";
import { Matrix2d } from "../model/math/matrix/matrix2d";
import { Polygon2d } from "../model/geometry/surface/polygon2d";
import { Polyline2d } from "../model/geometry/line/polyline2d";
import { GeometryHelper } from "./geometry.helper";
import { Point } from "../model/geometry/point/point";

let edgeId = 0;
let nodeId = 0;

class Edge {

    private id = 0;

    public get Id() {
        return this.id;
    }

    public get Curve() {
        return this.curve;
    }

    public get From() {
        return this.from;
    }

    public get To() {
        return this.to;
    }

    public Reverse!: Edge;

    public Left: boolean = false;
    public Right: boolean = false;

    constructor(private curve: Curve2d, private from: Node, private to: Node) {
        this.id = edgeId++;
    }

    public CreateMatrix() {
        const l = new Line2d(this.curve.From, this.curve.To)
        return l.GetMatrix("Left");
    }

    public HypotenuseTransform(matrix: Matrix2d) {
        const l = new Line2d(this.curve.From, this.curve.To)
        return l.Transform(matrix);
    }
}

class Node {
    private id = 0;

    public get Id() {
        return this.id;
    }

    public get Point() {
        return this.point;
    }

    public To: Edge[] = [];
    public From: Edge[] = [];
    constructor(private point: Point2d) {
        this.id = nodeId++;
    }
}

/**
 * 
 * @param curves 
 */
export function CreatePolygon(curves: Curve2d[], precision: number) {

    const rings: Edge[][] = [];

    const splitCurves = Split(curves);
    const mergeCurves = Merge(splitCurves, precision);
    const edges = CreateMap(mergeCurves, precision);

    for (const edge of edges) {
        if (!edge.Left) {
            const ring = GetRing(edge, true);
            if (ring.length > 0)
                rings.push(ring)
        }
        if (!edge.Right) {
            const ring = GetRing(edge, false);
            if (ring.length > 0)
                rings.push(ring)
        }
    }

    const filterRings = rings.filter(x => EdgesIsClockwise(x));
    const polygons = filterRings.map(x => GetPolygon(x))
        .sort((a, b) => b.GetArea() - a.GetArea());
    let [outers, inners]: Polygon2d[][] = [[], []];

    for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        const other = polygons.filter((x, j) => j > i);
        if (PolygonHasOther(polygon, other))
            outers.push(polygon);
        else
            inners.push(polygon);
    }

    if (outers.length == 0) {
        outers = [polygons[0]];
        inners = polygons.filter((x,i)=>i>0);
    }

    return [outers, inners];
}

/**
 * 分解
 * @param curves 
 */
export function Split(curves: Curve2d[]): Curve2d[] {
    const points = GetPointInCurves(curves);
    return curves.map((x, i) => GetCurveSplitCurves(x, points[i]))
        .flat()
        .filter(x => x.GetLength() > 1);
}

export function Merge(curves: Curve2d[], precision: number): Curve2d[] {

    const segs = curves.map(x => x instanceof Polyline2d ? x.GetSegments() : [x]).flat();
    const result: Curve2d[] = [];
    const mark = segs.map(x => 0);

    for (let i = 0; i < segs.length; i++) {
        if (mark[i] === 1)
            continue;

        result.push(segs[i]);
        for (let j = i + 1; j < segs.length; j++) {
            if (mark[j] === 1)
                continue;

            const seg1 = segs[i];
            const seg2 = segs[j];

            if (seg1 instanceof Line2d && seg2 instanceof Line2d) {
                if (LineEqual(seg1, seg2, precision))
                    mark[j] = 1;
            }

            if (seg1 instanceof Arc2d && seg2 instanceof Arc2d) {
                if (ArcEqual(seg1, seg2, precision))
                    mark[j] = 1;
            }
        }
    }

    return result;
}

function GetPointInCurves(curves: Curve2d[]): Point2d[][] {
    const result = curves.map(x => [x.From, x.To]);

    for (let i = 0; i < curves.length; i++) {
        const c1 = curves[i];

        for (let j = i + 1; j < curves.length; j++) {
            const c2 = curves[j];

            const reals = IntersectionHelper.GetRealIntersection(c1, c2);
            result[i].push(...reals);
            result[j].push(...reals);
        }
    }

    return result;
}

function GetCurveSplitCurves(curve: Curve2d, points: Point2d[]): Curve2d[] {

    if (points.length === 2)
        return [curve];

    const result: Curve2d[] = [];

    if (curve instanceof Line2d) {
        let a = Math.abs(Math.atan2(curve.To.Y - curve.From.Y, curve.To.X - curve.From.X));
        a = Math.abs(a > Math.PI / 2 ? Math.PI - 1 : a);
        points = a > Math.PI / 4 ? points.sort((a, b) => a.Y - b.Y) : points.sort((a, b) => a.X - b.X);

        for (let i = 1; i < points.length; i++)
            result.push(new Line2d(points[i - 1], points[i]));
    }
    else if (curve instanceof Arc2d) {

    }

    return result;
}

function CreateMap(curves: Curve2d[], precision: number): Edge[] {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    edgeId = 1;
    nodeId = 1;

    for (const curve of curves) {
        let f = new Node(curve.From);
        f = ReplaceNode(f, nodes, precision);
        let t = new Node(curve.To);
        t = ReplaceNode(t, nodes, precision);

        const edge1 = new Edge(curve, f, t);
        const edge2 = new Edge(curve.GetReverse(), t, f);
        edge1.Reverse = edge2;
        edge2.Reverse = edge1;

        f.To.push(edge1);
        t.From.push(edge1);
        edges.push(edge1);

        t.To.push(edge2);
        f.From.push(edge2);
        edges.push(edge2);
    }

    return edges;
}

function IsSameNode(node: Node, other: Node, precision: number) {
    return EqualWithPrecision(node.Point.X, other.Point.X, precision) && EqualWithPrecision(node.Point.Y, other.Point.Y, precision);
}

function ReplaceNode(node: Node, nodes: Node[], precision: number): Node {
    for (const i of nodes) {
        if (IsSameNode(node, i, precision)) {
            return i;
        }
    }

    nodes.push(node);
    return node;
}

function GetRing(edge: Edge, left: boolean) {

    const result: Edge[] = [];
    const idSet = new Set<number>();
    let next: Edge | undefined = edge;

    while (true) {

        if (next === undefined)
            break;
        if (idSet.has(next.Id)) {
            if (result.length > 1 && next.Id === result[0].Id) {
                result.every(x => left ? x.Left = true : x.Right = true);
                return result;
            }
            else {
                console.log("路径错误");
                break;
            }
        }

        result.push(next);
        idSet.add(next.Id);

        if (left && next.Left)
            break;
        if (!left && next.Right)
            break;

        next = NextEdge(next, left);
    }

    return [];
}

function NextEdge(edge: Edge, left: boolean) {
    const m = edge.CreateMatrix()!;

    const result = edge.To.To
        .filter(x => x.Reverse.Id !== edge.Id)
        .reduce((result: Edge | undefined, next) => {

            if (result === undefined) {
                if (left && !next.Left)
                    return next;
                else if (!left && !next.Right)
                    return next;
                else
                    return result;
            }

            if (left && next.Left)
                return result;
            if (!left && next.Right)
                return result;

            const h1 = result.HypotenuseTransform(m);
            let a1 = Math.atan2(h1.To.Y - h1.From.Y, h1.To.X - h1.From.X);
            a1 = Math.abs(a1) === Math.PI ? 0 : Math.PI - a1;

            const h2 = next.HypotenuseTransform(m);
            let a2 = Math.atan2(h2.To.Y - h2.From.Y, h2.To.X - h2.From.X);
            a2 = Math.abs(a2) === Math.PI ? 0 : Math.PI - a2;

            if (left) {
                if (a2 < a1)
                    return next;
            }

            if (!left) {
                if (a2 > a1)
                    return next;
            }

            return result;
        }, undefined)

    return result;
}

function GetPolygon(edges: Edge[]) {
    const out = new Polyline2d();

    for (const edge of edges) {
        if (edge.Curve instanceof Line2d)
            out.AddLine(edge.Curve);
        else if (edge.Curve instanceof Arc2d)
            out.AddLine(edge.Curve);
    }

    return new Polygon2d(out);
}

/**
 * 多边形是否是顺时针
 * @param polygon 
 * @returns 
 */
export function PolylineIsClockwise(polyline: Polyline2d) {

    const vertexs = polyline.GetVertexs();
    let area = 0;

    for (let i = 0; i < vertexs.length; i++) {
        const vertex = vertexs[i];
        const next = vertexs[(i + 1) % vertexs.length];

        area += (vertex.X * next.Y - next.X * vertex.Y);
    }

    return area < 0;
}

/**
 * 多边形是否是顺时针
 * @param polygon 
 * @returns 
 */
export function PolygonIsClockwise(polygon: Polygon2d) {
    return PolylineIsClockwise(polygon.Outer);
}

function EdgesIsClockwise(edges: Edge[]) {
    const polygon = GetPolygon(edges);
    return PolygonIsClockwise(polygon);
}

function PolygonHasOther(polygon: Polygon2d, polygonList: Polygon2d[]) {

    for (const item of polygonList) {

        if (item.BoundingBox.MaxPoint.X <= polygon.BoundingBox.MinPoint.X)
            continue;
        if (item.BoundingBox.MinPoint.X >= polygon.BoundingBox.MaxPoint.X)
            continue;
        if (item.BoundingBox.MaxPoint.Y <= polygon.BoundingBox.MinPoint.Y)
            continue;
        if (item.BoundingBox.MinPoint.Y >= polygon.BoundingBox.MaxPoint.Y)
            continue;

        const center = item.GetPointIn();
        if (polygon.IsPointIn(center))
            return true;
    }

    return false;
}