import { container } from "tsyringe";
import * as shortid from "shortid";
import { GlobalDatabase } from "../data/global.database";
import { SetConfigType } from "../set.config.type";
import { Color } from "../model/other/color";
import { ILayer } from "../model/layer/layer";

/**
 * 获取图层
 * @param layerName 图层名
 * @returns 图层
 */
export function GetLayer(layerName: string, color: string = Color.White().ToColorString()): ILayer {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const temp = globalDatabase.GetLayerByName(layerName);

    if (temp === undefined) {
        const layer: ILayer = {
            Id: shortid.generate(),
            Name: layerName,
            Description: "",
            Color: color,
            IsVisible: true,
            IsLock: false
        }
        globalDatabase.AddLayers(layer);
    }

    const result = globalDatabase.GetLayerByName(layerName);
    return result!;
}

/**
 * 获取图层
 * @param layerName 图层名
 * @returns 图层
 */
export function GetCurrentLayer(): ILayer {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const temp = globalDatabase.GetCurrentLayer();
    if (temp !== undefined && temp.length > 0)
        return temp[0];

    const layer: ILayer = {
        Id: shortid.generate(),
        Name: "0",
        Description: "",
        Color: Color.White().ToColorString(),
        IsVisible: true,
        IsLock: false
    }
    globalDatabase.AddLayers(layer);

    const result = globalDatabase.GetLayerByName("0");
    return result!;
}

/**
 * 获取图层
 * @param layerName 图层名
 * @returns 图层
 */
export function GetLayerById(layerId: string): ILayer | undefined {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const layers = globalDatabase.GetLayers(layerId);

    const result = layers.length === 0 ? undefined : layers[0]
    return result;
}
