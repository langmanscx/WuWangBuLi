/**
 * 配置类型
 */
export class SetConfigType {

    static get Canvas() { return "Canvas"; }
    static get InteranctiveCanvas() { return "InteranctiveCanvas"; }    
    static get ScopeTokenList() { return "ScopeTokenList"; }
    static get ViewSet() { return "ViewSet"; }

    static get DataService() { return "DataService"; }
    static get HistoryService() { return "HistoryService"; }
    static get CommandService() { return "CommandService"; }
    static get MessageService() { return "MessageService"; }

    static get GlobalDatabase() { return "GlobalDatabase"; }
    static get HistoryDatabase() { return "HistoryDatabase"; }
    static get ViewDatabase() { return "ViewDatabase"; }

    static get KeyController() { return "KeyController"; }
    static get MouseController() { return "MouseController"; }
    static get TouchController() { return "TouchController"; }
    static get MenuController() { return "MenuController"; }
    static get CameraController() { return "CameraController"; }
    static get RenderController() { return "RenderController"; }

    static get KeyService() { return "KeyService"; }
    static get MouseService() { return "MouseService"; }
    static get TouchService() { return "TouchService"; }
    static get MenuService() { return "MenuService"; }
    static get ActivateService() { return "DeviceActivate"; }

    static get PointPickService() { return "PointPickService"; }
    static get EntitySelectionService() { return "EntitySelectionService"; }
    static get InputService() { return "InputService"; }

    static get PointPickController() { return "PointPickController"; }
    static get EntitySelectionController() { return "EntitySelectionController"; }

    static get InteranctiveRenderController() { return "InteranctiveRenderController"; }
    
    static get DivideController() { return "DivideController"; }
    static get ViewConfiguration() { return "ViewConfig"; }

    static get Relation() { return "Relation"; }
    static get Clipping() { return "Clipping"; }
}