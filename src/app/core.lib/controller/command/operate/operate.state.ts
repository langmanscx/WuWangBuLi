export enum OperateState {
    /**
     * 休眠的，未开始的
     */
    Dormant = 0,
    /**
     * 开始
     */
    Start = 1,
    /**
     * 等待
     */
    Wait = 2,
    /**
     * 下一步
     */
    Next = 3,
    /**
     * 完成
     */
    Finish = 4,
    /**
     * 取消
     */
    Cancel = 5,
    /**
     * 错误
     */
    Error = 9
}