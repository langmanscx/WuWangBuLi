import { container } from "tsyringe";
import { SetConfigType } from "../set.config.type";
import { GlobalDatabase } from "../data/global.database";
import { IMaterial } from "../model/material/i.material";

/**
 * 获取材质
 * @param materialName 材质名
 * @returns 材质
 */
export function GetMaterial(materialName: string, material: IMaterial): IMaterial {

    const globalDatabase = container.resolve<GlobalDatabase>(SetConfigType.GlobalDatabase);
    const temp = globalDatabase.GetMaterialByName(materialName);
    if (temp === undefined) {
        globalDatabase.AddMaterials(material);
        return material;
    }
    else {
        return temp;
    }
}
