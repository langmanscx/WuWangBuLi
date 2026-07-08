/**
 * 颜色RGBA
 */
export class RGBA {
    /**
     * 红
     */
    public get Red(): number {
        return this.red;
    }

    /**
     * 绿
     */
    public get Green(): number {
        return this.green;
    }

    /**
     * 蓝
     */
    public get Blue(): number {
        return this.blue;
    }

    /**
     * 透明度
     */
    public get Alpha(): number {
        return this.alpha;
    }

    /**
     * 颜色RGBA
     * @param red 红 整数0-255
     * @param green 绿 整数0-255
     * @param blue 蓝 整数0-255
     * @param alpha 透明度 小数0-1
     */
    constructor(private red: number = 255, private green: number = 255, private blue: number = 255, private alpha: number = 1) {
    }

    /**
     * 转换为颜色Color16
     */
    public ToColor16(): Color16 {
        var red = String.fromCharCode(this.red);
        var green = String.fromCharCode(this.green);
        var blue = String.fromCharCode(this.blue);
        return new Color16("#" + red + green + blue);
    }


    /**
     * 转换为颜色Color16
     */
    public ToRGB(): RGB {
        return new RGB(this.red, this.green, this.blue);
    }

    /**
     * 从文字获取颜色
     * @param str 文字
     * @returns RGBA
     */
    public static FromColorString(str: string): RGBA {
        var str = str.substring(5, str.length - 1);
        str = str.replace('(', '');
        str = str.replace(')', '');

        var arr = str.split(',');
        var num = new Array<number>(4);
        num[0] = Number(arr[0]);
        num[1] = Number(arr[1]);
        num[2] = Number(arr[2]);
        num[3] = Number(arr[3]);

        num[0] = num[0] === Number.NaN ? 0 : Math.round(num[0] % 256);
        num[1] = num[1] === Number.NaN ? 0 : Math.round(num[1] % 256);
        num[2] = num[2] === Number.NaN ? 0 : Math.round(num[2] % 256);
        num[3] = num[3] === Number.NaN ? 0 : Math.round(num[3] % 256);

        return new RGBA(num[0], num[1], num[2], num[3]);
    }

    /**
     * 转字符串
     * @returns 字符串
     */
    public ToColorString() {
        return `RGBA(${this.red},${this.green},${this.blue},${this.alpha})`;
    }
}

/**
 * 颜色RGB
 */
export class RGB {
    /**
     * 红
     */
    public get Red(): number {
        return this.red;
    }

    /**
     * 绿
     */
    public get Green(): number {
        return this.green;
    }

    /**
     * 蓝
     */
    public get Blue(): number {
        return this.blue;
    }

    /**
     * 颜色RGB
     * @param red 红 整数0-255
     * @param green 绿 整数0-255
     * @param blue 蓝 整数0-255
     */
    constructor(private red: number = 255, private green: number = 255, private blue: number = 255) {
    }

    /**
     * 转换为颜色Color16
     */
    public ToColor16(): Color16 {
        const red = this.red === 0 ? "00" : this.red.toString(16);
        const green = this.green === 0 ? "00" : this.green.toString(16);
        const blue = this.blue === 0 ? "00" : this.blue.toString(16);
        return new Color16("#" + red + green + blue);
    }

    /**
     * 转换为颜色RGBA
     */
    public ToRGBA(): RGBA {
        return new RGBA(this.red, this.green, this.blue);
    }

    /**
     * 从文字获取颜色
     * @param str 文字
     */
    public static FromColorString(str: string): RGB {
        var str = str.substring(4, str.length - 1);
        str = str.replace('(', '');
        str = str.replace(')', '');

        var arr = str.split(',');
        var num = new Array<number>(3);
        num[0] = Number(arr[0]);
        num[1] = Number(arr[1]);
        num[2] = Number(arr[2]);

        num[0] = num[0] === Number.NaN ? 0 : Math.round(num[0] % 256);
        num[1] = num[1] === Number.NaN ? 0 : Math.round(num[1] % 256);
        num[2] = num[2] === Number.NaN ? 0 : Math.round(num[2] % 256);

        return new RGB(num[0], num[1], num[2]);
    }

    /**
     * 转字符串
     * @returns 字符串
     */
    public ToColorString() {
        return `RGB(${this.red},${this.green},${this.blue})`;
    }
}

/**
 * 颜色16进制
 */
export class Color16 {
    /**
     * 颜色编号
     */
    public get Code(): string {
        return this.code;
    }

    /**
     * 颜色16进制
     * @param code 颜色编号
     */
    constructor(private code: string = "#ffffff") {
    }

    /**
     * 从文字获取颜色
     * @param str 文字
     * @returns Color16
     */
    public static FromColorString(str: string): Color16 {
        const red = parseInt(str.substring(1, 3), 16);
        const green = parseInt(str.substring(3, 5), 16);
        const blue = parseInt(str.substring(5, 7), 16);
        return new RGB(red, green, blue).ToColor16();
    }

    /**
     * 转换为颜色RGB
     */
    public ToRGB(): RGB {
        if (this.code.length != 7) {
            return new RGB();
        }
 
        const red = parseInt(this.code.substring(1, 3), 16);
        const green = parseInt(this.code.substring(3, 5), 16);
        const blue = parseInt(this.code.substring(5, 7), 16);
        return new RGB(red, green, blue);
    }

    /**
     * 转换为颜色RGBA
     */
    public ToRGBA(): RGBA {
        return this.ToRGB().ToRGBA();
    }

    /**
     * 转字符串
     * @returns 字符串
     */
    public ToColorString() {
        return this.code;
    }
}

export class Color {

    /**
     * 白色
     * @returns 
     */
    public static White() {
        return new RGBA(255, 255, 255);
    }

    /**
     * 黑色
     * @returns 
     */
    public static Black() {
        return new RGBA(255, 255, 255);
    }

    /**
     * 红色
     * @returns 
     */
    public static Red() {
        return new RGBA(255, 0, 0);
    }

    /**
     * 绿色
     * @returns 
     */
    public static Green() {
        return new RGBA(0, 255, 0);
    }

    /**
     * 蓝色
     * @returns 
     */
    public static Blue() {
        return new RGBA(0, 0, 255);
    }

    /**
     * 深灰
     * @returns 
     */
    public static DarkGrey() {
        return new RGBA(63, 63, 63);
    }

    /**
     * 灰色
     * @returns 
     */
    public static Grey() {
        return new RGB(127, 127, 127);
    }

    /**
     * 黄色
     * @returns 
     */
    public static Yellow() {
        return new RGB(255, 223, 0);
    }

    /**
     * 洋红
     * @returns 
     */
    public static Magenta() {
        return new RGB(228, 0, 127);
    }

    /**
     * 
     * @param content 颜色字符串
     * @returns 
     */
    public static FromColorString(content: string): RGBA | RGB | Color16 | undefined {
        if (content.includes("RGBA")) {
            return RGBA.FromColorString(content);
        }
        else if (content.includes("RGB")) {
            return RGB.FromColorString(content);
        }
        else if (content.includes("#")) {
            return Color16.FromColorString(content);
        }
        else {
            return undefined;
        }
    }
}