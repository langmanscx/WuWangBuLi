export class Point {   

    /**
     * X坐标
     */
    public get X(): number {
        return this.x;
    }

    /**
     * Y坐标
     */
    public get Y(): number {
        return this.y;
    }

    /**
     * Y坐标
     */
    public get Z(): number {
        return this.z;
    }

    constructor(private x: number, private y: number, private z: number) {
    }
}