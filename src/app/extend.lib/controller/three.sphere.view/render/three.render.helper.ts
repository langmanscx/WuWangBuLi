import { GlobalDatabase } from "src/app/core.lib/data/global.database";
import { IGeometry } from "src/app/core.lib/model/geometry/i.geometry";
import { Arc2d } from "src/app/core.lib/model/geometry/line/arc2d";
import { Line2d } from "src/app/core.lib/model/geometry/line/line2d";
import { Polyline2d } from "src/app/core.lib/model/geometry/line/polyline2d";
import { Point2d } from "src/app/core.lib/model/geometry/point/point2d";
import { Vertex2d } from "src/app/core.lib/model/geometry/point/vertex2d";
import { ExtrudedSolid } from "src/app/core.lib/model/geometry/solid/extruded.solid";
import { TransformArray } from "src/app/core.lib/model/geometry/solid/transform.array";
import { Polygon2d } from "src/app/core.lib/model/geometry/surface/polygon2d";
import { IMaterial } from "src/app/core.lib/model/material/i.material";
import { PhysicalMaterial } from "src/app/core.lib/model/material/physical.material";
import { StandardMaterial } from "src/app/core.lib/model/material/standard.material";
import { Color16, Color as MC, RGB, RGBA } from "src/app/core.lib/model/other/color";
import { ClippingBox } from "src/app/core.lib/model/thing/clipping.box";
import { SetConfigType } from "src/app/core.lib/set.config.type";
import {
    BufferGeometry, Color, DoubleSide, ExtrudeGeometry, Group, InstancedMesh, Material, Matrix4, Mesh, MeshLambertMaterial,
    MeshPhysicalMaterial, MeshStandardMaterial, Object3D, ObjectSpaceNormalMap, Plane, Shape,
    TangentSpaceNormalMap, Texture, TextureLoader, Vector2, Vector3
} from "three";
import { container } from "tsyringe";


export class ThreeRenderHelper {

    protected static MaterialMap: Map<string, Material> = new Map<string, Material>();

    /**
     * 生成图形
     * @param data 图形元素 
     * @returns three的BufferGeometry
     */
    public static CreateGeometry(data: IGeometry): BufferGeometry {

        if (data instanceof ExtrudedSolid) {
            const [[n11, n12, n13, n14], [n21, n22, n23, n24], [n31, n32, n33, n34]] = data.TransformArray;
            const matrix = new Matrix4(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, 0, 0, 0, 1);
            const solid = this.CreateExtrudedSolid(data);
            solid.applyMatrix4(matrix);

            return solid;
        }

        return new BufferGeometry();
    }
    /**
     * 生成图形
     * @param data 图形元素 
     * @returns three的BufferGeometry
     */
    public static CreateGeometryAndBox(line: Line2d, thickness: number, height: number, clipboxes: ClippingBox[]): BufferGeometry {

        const scaleFrom = new Point2d(line.From.X, line.From.Y);
        const scaleTo = new Point2d(line.To.X, line.To.Y);
        const scaleLine = new Line2d(scaleFrom, scaleTo);

        const m = scaleLine.GetMatrix("Left")!;
        const l = scaleLine.Transform(m);
        const ovs: Vertex2d[] = [
            new Vertex2d(0, 0, 0),
            new Vertex2d(0, height, 0),
            new Vertex2d(l.To.X, height, 0),
            new Vertex2d(l.To.X, 0, 0)
        ];
        const outer = new Polyline2d(ovs, true);

        const inners: Polyline2d[] = [];
        for (const box of clipboxes) {
            const f = box.From.Transform(m);
            const t = box.To.Transform(m);
            const ivs: Vertex2d[] = [
                new Vertex2d(f.X, box.AboveGround, 0),
                new Vertex2d(f.X, box.AboveGround + box.Height, 0),
                new Vertex2d(t.X, box.AboveGround + box.Height, 0),
                new Vertex2d(t.X, box.AboveGround, 0)
            ];
            inners.push(new Polyline2d(ivs, true));
        }

        const bottom = new Polygon2d(outer, inners);
        const a = Math.atan2(scaleLine.To.Y - scaleLine.From.Y, scaleLine.To.X - scaleLine.From.X);
        const c = Math.cos(a);
        const s = Math.sin(a);
        const transform: TransformArray = [
            [c, 0, s, scaleLine.From.X - thickness * 0.5 * s],
            [s, 0, -c, scaleLine.From.Y + thickness * 0.5 * c],
            [0, 1, 0, 0]
        ];

        const solid = new ExtrudedSolid(bottom, thickness, transform);

        return this.CreateGeometry(solid);
    }

    /**
     * 生成材质
     * @param data 
     * @returns three的Material
     */
    public static CreateMaterial(materialId: string): Material {

        if (this.MaterialMap.has(materialId)) {
            return this.MaterialMap.get(materialId)!;
        }

        const global = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
        const materialDatas = global.GetMaterials(materialId);
        if (materialDatas.length === 0)
            return new MeshLambertMaterial();

        if (materialDatas[0] instanceof StandardMaterial) {
            const material = this.CreateStandardMaterial(materialDatas[0]);
            this.MaterialMap.set(materialId, material);
            return material;
        }
        else if (materialDatas[0] instanceof PhysicalMaterial) {
            const material = this.CreatePhysicalMaterial(materialDatas[0]);
            this.MaterialMap.set(materialId, material);
            return material;
        }
        else {
            return new MeshLambertMaterial();
        }
    }

    /**
     * 生成网格
     * @param geometry three的BufferGeometry
     * @param material three的Material
     * @returns three的Mesh
     */
    public static CreateMesh(geometry: BufferGeometry, material: Material): Mesh {
        const matrix = new Matrix4().scale(new Vector3(0.001, 0.001, 0.001));
        geometry = geometry.applyMatrix4(matrix);

        const uvAttribute = geometry.getAttribute('uv');
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            uvAttribute.setXY(i, u / 1000, v / 1000);
        }

        return new Mesh(geometry, material);
    }

    /**
     * 生成网格
     * @param geometry three的BufferGeometry
     * @param material three的Material
     * @returns three的Mesh
     */
    public static CreateInstancedMesh(geometry: BufferGeometry, material: Material, count: number): InstancedMesh {
        const matrix = new Matrix4().scale(new Vector3(0.001, 0.001, 0.001));
        geometry = geometry.applyMatrix4(matrix);

        const uvAttribute = geometry.getAttribute('uv');
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            uvAttribute.setXY(i, u / 1000, v / 1000);
        }

        return new InstancedMesh(geometry, material, count);
    }

    public static CloneMaterial(geometry: BufferGeometry, material: Material) {
        const uvAttribute = geometry.getAttribute('uv');
        let maxu = 1;
        let maxv = 1;
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            maxu = Math.max(maxu, u);
            maxv = Math.max(maxv, v);
        }

        if (material instanceof MeshStandardMaterial) {
            if (material.map) {

                const clone = material.clone();
                const repeatX2 = maxu / 1000;
                const repeatY2 = maxv / 1000;

                clone.map?.repeat.set(repeatX2, repeatY2);
                clone.normalMap?.repeat.set(repeatX2, repeatY2);
                clone.roughnessMap?.repeat.set(repeatX2, repeatY2);
                clone.displacementMap?.repeat.set(repeatX2, repeatY2);
                clone.lightMap?.repeat.set(repeatX2, repeatY2);

                return clone;
            }
        }

        return material;
    }

    /**
     * 生成一个拉伸实体
     * @param data 拉伸实体
     * @returns three的拉伸几何
     */
    protected static CreateExtrudedSolid(data: ExtrudedSolid): ExtrudeGeometry {

        const shape = this.CreateShapeByPolygon(data.Bottom);
        const options = {
            depth: data.Height,
            bevelEnabled: false,
            steps: 4
        };

        return new ExtrudeGeometry(shape, options);
    }

    /**
     * 生成一个Shape
     * @param data 闭合面
     * @returns Shape
     */
    protected static CreateShapeByPolygon(data: Polygon2d): Shape {
        const result = this.CreateShapeByPolyline(data.Outer);

        if (data.Inners === undefined)
            return result;

        for (const inner of data.Inners) {
            const hole = this.CreateShapeByPolyline(inner);
            result.holes.push(hole);
        }

        return result;
    }

    /**
     * 生成一个Shape
     * @param data 闭合多段线
     * @returns Shape
     */
    protected static CreateShapeByPolyline(data: Polyline2d): Shape {

        const result = new Shape();

        const cs = data.GetSegments();
        if (cs.length === 0)
            return new Shape();

        if (cs[0] instanceof Line2d) {
            const line = cs[0] as Line2d;
            result.moveTo(line.From.X, line.From.Y);
        }
        if (cs[0] instanceof Arc2d) {
            const arc = cs[0] as Arc2d;
            const x = arc.Center.X + Math.cos(arc.FromAngle) * arc.Radius;
            const y = arc.Center.Y + Math.sin(arc.FromAngle) * arc.Radius;
            result.moveTo(x, y);
        }

        for (const curve of cs) {

            if (curve instanceof Line2d) {
                const line = curve as Line2d;
                result.lineTo(line.To.X, line.To.Y);
            }
            if (curve instanceof Arc2d) {
                const arc = curve as Arc2d;
                const sa = arc.FromAngle;
                const ea = arc.FromAngle + arc.SweepAngle;
                result.arc(arc.Center.X, arc.Center.Y, arc.Radius, sa, ea, arc.IsClockwise);
            }
        }

        result.closePath();
        return result;
    }

    /**
     * 生成标准材料
     * @param data 标准材料数据
     */
    protected static CreateStandardMaterial(data: StandardMaterial): MeshStandardMaterial {
        const result = new MeshStandardMaterial();

        if (data.Map !== undefined && data.Map !== "")
            result.map = this.CreateTexture(data.Map);

        if (data.LightMap !== undefined && data.LightMap !== "")
            result.lightMap = this.CreateTexture(data.LightMap);

        if (data.EmissiveMap !== undefined && data.EmissiveMap !== "")
            result.emissiveMap = this.CreateTexture(data.EmissiveMap);

        if (data.AoMap !== undefined && data.AoMap !== "")
            result.aoMap = this.CreateTexture(data.AoMap);

        if (data.RoughnessMap !== undefined && data.RoughnessMap !== "")
            result.roughnessMap = this.CreateTexture(data.RoughnessMap);

        if (data.AlphaMap !== undefined && data.AlphaMap !== "")
            result.alphaMap = this.CreateTexture(data.AlphaMap);

        if (data.NormalMap !== undefined && data.NormalMap !== "")
            result.normalMap = this.CreateTexture(data.NormalMap);

        if (data.MetalnessMap !== undefined && data.MetalnessMap !== "")
            result.metalnessMap = this.CreateTexture(data.MetalnessMap);

        if (data.DisplacementMap !== undefined && data.DisplacementMap !== "")
            result.displacementMap = this.CreateTexture(data.DisplacementMap);

        if (data.BumpMap !== undefined && data.BumpMap !== "")
            result.bumpMap = this.CreateTexture(data.BumpMap);

        if (data.EnvMap !== undefined && data.EnvMap !== "")
            result.envMap = this.CreateTexture(data.EnvMap);

        result.transparent = data.Transparent;
        result.opacity = data.opacity;
        result.color = this.ColorCreate(data.ColorCode);
        result.lightMapIntensity = data.LightMapIntensity;
        result.emissive = this.ColorCreate(data.EmissiveColorCode);
        result.emissiveIntensity = data.EmissiveIntensity;
        result.aoMapIntensity = data.AoMapIntensity;
        result.roughness = data.Roughness;
        result.metalness = data.Metalness;
        result.bumpScale = data.BumpScale;
        result.envMapIntensity = data.EnvMapIntensity;
        result.normalMapType = data.NormalMapType === "TangentSpace" ? TangentSpaceNormalMap : ObjectSpaceNormalMap;
        result.normalScale = new Vector2(data.NormalScale[0], data.NormalScale[1]);
        result.displacementScale = data.DisplacementScale;
        result.displacementBias = data.DisplacementBias;
        result.wireframe = data.WireFrame;
        result.wireframeLinewidth = data.WireFrameLineWidth;
        result.fog = data.Fog;
        result.flatShading = data.FlatShading;
        result.side = DoubleSide;

        return result;
    }

    /**
     * 生成物理材料
     * @param data 物力材料数据
     */
    protected static CreatePhysicalMaterial(data: PhysicalMaterial): MeshPhysicalMaterial {
        const result = new MeshPhysicalMaterial();

        if (data.Map !== undefined && data.Map !== "")
            result.map = this.CreateTexture(data.Map);

        if (data.LightMap !== undefined && data.LightMap !== "")
            result.lightMap = this.CreateTexture(data.LightMap);

        if (data.EmissiveMap !== undefined && data.EmissiveMap !== "")
            result.emissiveMap = this.CreateTexture(data.EmissiveMap);

        if (data.AoMap !== undefined && data.AoMap !== "")
            result.aoMap = this.CreateTexture(data.AoMap);

        if (data.RoughnessMap !== undefined && data.RoughnessMap !== "")
            result.roughnessMap = this.CreateTexture(data.RoughnessMap);

        if (data.AlphaMap !== undefined && data.AlphaMap !== "")
            result.alphaMap = this.CreateTexture(data.AlphaMap);

        if (data.NormalMap !== undefined && data.NormalMap !== "")
            result.normalMap = this.CreateTexture(data.NormalMap);

        if (data.MetalnessMap !== undefined && data.MetalnessMap !== "")
            result.metalnessMap = this.CreateTexture(data.MetalnessMap);

        if (data.DisplacementMap !== undefined && data.DisplacementMap !== "")
            result.displacementMap = this.CreateTexture(data.DisplacementMap);

        if (data.BumpMap !== undefined && data.BumpMap !== "")
            result.bumpMap = this.CreateTexture(data.BumpMap);

        if (data.EnvMap !== undefined && data.EnvMap !== "")
            result.envMap = this.CreateTexture(data.EnvMap);

        if (data.IridescenceMap !== undefined && data.IridescenceMap !== "")
            result.iridescenceMap = this.CreateTexture(data.IridescenceMap);

        if (data.SheenRoughnessMap !== undefined && data.SheenRoughnessMap !== "")
            result.sheenRoughnessMap = this.CreateTexture(data.SheenRoughnessMap);

        if (data.SheenColorMap !== undefined && data.SheenColorMap !== "")
            result.sheenColorMap = this.CreateTexture(data.SheenColorMap);

        if (data.ClearcoatMap !== undefined && data.ClearcoatMap !== "")
            result.clearcoatMap = this.CreateTexture(data.ClearcoatMap);

        if (data.ClearcoatNormalMap !== undefined && data.ClearcoatNormalMap !== "")
            result.clearcoatNormalMap = this.CreateTexture(data.ClearcoatNormalMap);

        if (data.ClearcoatRoughnessMap !== undefined && data.ClearcoatRoughnessMap !== "")
            result.clearcoatRoughnessMap = this.CreateTexture(data.ClearcoatRoughnessMap);

        result.transparent = data.Transparent;
        result.opacity = data.opacity;
        result.color = this.ColorCreate(data.ColorCode);
        result.lightMapIntensity = data.LightMapIntensity;
        result.emissive = this.ColorCreate(data.EmissiveColorCode);
        result.emissiveIntensity = data.EmissiveIntensity;
        result.aoMapIntensity = data.AoMapIntensity;
        result.roughness = data.Roughness;
        result.metalness = data.Metalness;
        result.bumpScale = data.BumpScale;
        result.envMapIntensity = data.EnvMapIntensity;
        result.normalMapType = data.NormalMapType === "TangentSpace" ? TangentSpaceNormalMap : ObjectSpaceNormalMap;
        result.normalScale = new Vector2(data.NormalScale[0], data.NormalScale[1]);
        result.displacementScale = data.DisplacementScale;
        result.displacementBias = data.DisplacementBias;
        result.wireframe = data.WireFrame;
        result.wireframeLinewidth = data.WireFrameLineWidth;
        result.fog = data.Fog;
        result.flatShading = data.FlatShading;
        result.ior = data.Ior;
        result.reflectivity = data.Reflectivity;
        result.iridescence = data.Iridescence;
        result.iridescenceIOR = data.IridescenceIOR;
        result.sheen = data.Sheen;
        result.sheenRoughness = data.SheenRoughness;
        result.sheenColor = this.ColorCreate(data.SheenColorCode);
        result.clearcoat = data.Clearcoat;
        result.clearcoatNormalScale = new Vector2(data.ClearcoatNormalScale[0], data.ClearcoatNormalScale[1]);
        result.clearcoatRoughness = data.ClearcoatRoughness;
        result.side = DoubleSide;

        return result;
    }

    /**
     * 创建纹理
     * @param url 纹理地址
     * @returns 
     */
    protected static CreateTexture(url: string): Texture {
        const result = new TextureLoader().load(url);
        result.wrapS = 1000;
        result.wrapT = 1000;
        return result;
    }

    public static CreateClippingBox(clip: ClippingBox): Plane[] {

        let v = new Vector3(clip.To.X - clip.From.X, clip.To.Y - clip.From.Y, 0);
        v = v.normalize();
        const n = v.clone().negate()

        const midPoint = new Point2d((clip.To.X + clip.From.X) / 2, (clip.To.Y + clip.From.Y) / 2);
        const midHeight = clip.AboveGround + clip.Height / 2;

        let planes: Plane[] = [];
        planes[0] = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, -1), new Vector3(midPoint.X, midPoint.Y, clip.AboveGround));
        planes[1] = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), new Vector3(midPoint.X, midPoint.Y, clip.AboveGround + clip.Height));
        planes[2] = new Plane().setFromNormalAndCoplanarPoint(v, new Vector3(clip.To.X, clip.To.Y, midHeight));
        planes[3] = new Plane().setFromNormalAndCoplanarPoint(n, new Vector3(clip.From.X, clip.From.Y, midHeight));

        return planes;
    }

    private static ColorCreate(colorCode: string): Color {
        let r: RGB = new RGB();
        const c = MC.FromColorString(colorCode);

        if (c instanceof RGBA)
            r = c.ToRGB();
        else if (c instanceof RGB)
            r = c;
        else if (c instanceof Color16)
            r = c.ToRGB();

        return new Color(r.Red / 255, r.Green / 255, r.Blue / 255);
    }


    /**
     * 在场景中移除
     * @param object3 父节点
     * @param thingids 物体Id
     */
    public static RemoveObject(object3: Object3D, thingids?: string[]) {

        let finds: Object3D[] = [];
        object3.traverse(x => {
            if (x instanceof Mesh || x instanceof Group) {
                if (thingids !== undefined) {
                    if (thingids.includes(x.name))
                        finds.push(x);
                }
                else {
                    finds.push(x);
                }
            }
        });
        object3.remove(...finds);
    }
}