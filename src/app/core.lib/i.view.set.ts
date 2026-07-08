export interface IViewSet {

    /**
     * 作用域Token，以便访问同一作用域的其他控制
     */
    ScopeToken: string;

    /**
     * 注册
     * @param canvas dom的canvas元素
     * @param interanctive dom的canvas元素,用于交互
     */
    Register(canvas: HTMLCanvasElement, interanctive?: HTMLCanvasElement): void;
}