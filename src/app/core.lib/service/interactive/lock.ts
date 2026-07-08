import { DependencyContainer, container } from "tsyringe";
import { SetConfigType } from "../../set.config.type";
import { PointPickService } from "./point.pick.service";
import { InputService } from "./input.service";
import { EntitySelectionService } from "./entity.selection.service";

/**
 * 点捕捉加锁
 */
export function PointPickLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);

        if (child.isRegistered(SetConfigType.PointPickService)) {
            const pointPick = child.resolve<PointPickService>(SetConfigType.PointPickService);
            pointPick.Lock = true;
        }
    }
}

/**
 * 点捕捉解锁
 */
export function UnPointPickLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);

        if (child.isRegistered(SetConfigType.PointPickService)) {
            const pointPick = child.resolve<PointPickService>(SetConfigType.PointPickService);
            pointPick.Lock = false;
        }
    }
}

/**
 * 输入加锁
 */
export function InputLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);   

        if (child.isRegistered(SetConfigType.InputService)) {
            const input = child.resolve<InputService>(SetConfigType.InputService);
            input.Lock = true;
        }
    }
}

/**
 * 输入解锁
 */
export function UnInputLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);

        if (child.isRegistered(SetConfigType.InputService)) {
            const input = child.resolve<InputService>(SetConfigType.InputService);
            input.Lock = false;
        }
    }
}

/**
 * 实体查询加锁
 */
export function EntitySelectionLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);   

        if (child.isRegistered(SetConfigType.EntitySelectionService)) {
            const selection = child.resolve<EntitySelectionService>(SetConfigType.EntitySelectionService);
            selection.Lock = true;
        }
    }
}

/**
 * 实体查询解锁
 */
export function UnEntitySelectionLock() {
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);
    for (const token of list) {
        const child = container.resolve<DependencyContainer>(token);

        if (child.isRegistered(SetConfigType.EntitySelectionService)) {
            const selection = child.resolve<EntitySelectionService>(SetConfigType.EntitySelectionService);
            selection.Lock = false;
        }
    }
}