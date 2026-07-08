import { Subject } from "rxjs";
import { BaseController } from "../base.controller";
import { IKeyController } from "./i.key.controller";

/**
 * 键盘控制器基类
 */
export abstract class BaseKeyController extends BaseController implements IKeyController {

   /**
    * 枚举的选择监听
    */
   protected stringSubject: Subject<{ Key: string, Code: string }> = new Subject<{ Key: string, Code: string }>();

   public get StringObservable() {
      return this.stringSubject.asObservable();
   }

   OnKeyDown(event: KeyboardEvent): void {
      //阻止冒泡 
      event.stopPropagation();
      event.preventDefault();

      this.stringSubject.next({ Key: event.key, Code: event.code });
   }

   OnKeyUp(event: KeyboardEvent): void {
      //阻止冒泡 
      event.stopPropagation();
      event.preventDefault();
   }
}