import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RunCommand } from 'src/app/core.lib/service/command/run.command';
import { HistoryService } from 'src/app/core.lib/service/data/history.service';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { container } from 'tsyringe';
import { MockingFloor, MockingGrid, MockingOne } from '../../mock';
import { BuildLayer, ModifyLayer } from '../../model/node/building';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements AfterViewInit, OnChanges {
  @Input() buttonKey?: string;

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');
    this.context = this.canvas.getContext("2d")!;

    if (this.buttonKey !== undefined && this.context !== undefined)
      this.Drawing(this.buttonKey);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('buttonKey' in changes) {
      if (this.buttonKey !== undefined && this.context !== undefined)
        this.Drawing(this.buttonKey);
    }
  }

  //#region 图标  
  Drawing(key: string) {
    if (key === "测试") {
      this.TestDrawing(this.context);
    }
    else if (key === "测试网格") {
      this.TestGridDrawing(this.context);
    }
    else if (key === "直线") {
      this.LineDrawing(this.context);
    }
    else if (key === "圆弧") {
      this.ArcDrawing(this.context);
    }
    else if (key === "移动") {
      this.MoveDrawing(this.context);
    }
    else if (key === "镜像") {
      this.MirrorDrawing(this.context);
    }
    else if (key === "偏移") {
      this.OffsetDrawing(this.context);
    }
    else if (key === "阵列") {
      this.ArrayDrawing(this.context);
    }
    else if (key === "墙") {
      this.WallDrawing(this.context);
    }
    else if (key === "门") {
      this.DoorDrawing(this.context);
    }
    else if (key === "窗") {
      this.WindowDrawing(this.context);
    }
    else if (key === "地面") {
      this.FloorDrawing(this.context);
    }
    else if (key === "天花") {
      this.CeilingDrawing(this.context);
    }
    else if (key === "房间") {
      this.RoomDrawing(this.context);
    }
    else if (key === "楼梯") {
      this.StairsDrawing(this.context);
    }
    else if (key === "回退") {
      this.RollBackDrawing(this.context);
    }
    else if (key === "重复") {
      this.RollForwardDrawing(this.context);
    }
  }

  LineDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(10, 10, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(50, 50, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(10, 10);
    context.lineTo(50, 50);
    context.stroke();
  }

  ArcDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(10, 10, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(50, 50, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(10, 50, 40, Math.PI * 1.5, Math.PI * 2);
    context.stroke();
  }

  MoveDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(5, 30);
    context.lineTo(55, 30);
    context.stroke();

    context.beginPath();
    context.moveTo(5, 30);
    context.lineTo(10, 25);
    context.stroke();

    context.beginPath();
    context.moveTo(5, 30);
    context.lineTo(10, 35);
    context.stroke();

    context.beginPath();
    context.moveTo(55, 30);
    context.lineTo(50, 25);
    context.stroke();

    context.beginPath();
    context.moveTo(55, 30);
    context.lineTo(50, 35);
    context.stroke();

    context.beginPath();
    context.moveTo(30, 5);
    context.lineTo(30, 55);
    context.stroke();

    context.beginPath();
    context.moveTo(30, 5);
    context.lineTo(25, 10);
    context.stroke();

    context.beginPath();
    context.moveTo(30, 5);
    context.lineTo(35, 10);
    context.stroke();

    context.beginPath();
    context.moveTo(30, 55);
    context.lineTo(25, 50);
    context.stroke();

    context.beginPath();
    context.moveTo(30, 55);
    context.lineTo(35, 50);
    context.stroke();
  }

  MirrorDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(30, 5);
    context.lineTo(30, 55);
    context.stroke();

    context.beginPath();
    context.arc(10, 20, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(10, 25);
    context.lineTo(10, 45);
    context.stroke();

    context.beginPath();
    context.moveTo(5, 35);
    context.lineTo(15, 35);
    context.stroke();

    context.beginPath();
    context.arc(50, 20, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(50, 25);
    context.lineTo(50, 45);
    context.stroke();

    context.beginPath();
    context.moveTo(45, 35);
    context.lineTo(55, 35);
    context.stroke();
  }

  OffsetDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(10, 44);
    context.lineTo(46, 8);
    context.stroke();

    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(20, 52);
    context.lineTo(26, 46);
    context.stroke();

    context.beginPath();
    context.moveTo(35, 37);
    context.lineTo(41, 31);
    context.stroke();

    context.beginPath();
    context.moveTo(50, 22);
    context.lineTo(56, 16);
    context.stroke();
  }

  ArrayDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.arc(13, 13, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(30, 13, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(47, 13, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(13, 30, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(30, 30, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(47, 30, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(13, 47, 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    context.beginPath();
    context.arc(30, 47, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(47, 47, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

  }

  WallDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1;

    context.strokeRect(12, 12, 10, 5);
    context.strokeRect(22, 12, 10, 5);
    context.strokeRect(32, 12, 10, 5);
    context.strokeRect(42, 12, 10, 5);

    context.strokeRect(12, 22, 10, 5);
    context.strokeRect(22, 22, 10, 5);
    context.strokeRect(32, 22, 10, 5);
    context.strokeRect(42, 22, 10, 5);

    context.strokeRect(12, 32, 10, 5);
    context.strokeRect(22, 32, 10, 5);
    context.strokeRect(32, 32, 10, 5);
    context.strokeRect(42, 32, 10, 5);

    context.strokeRect(12, 42, 10, 5);
    context.strokeRect(22, 42, 10, 5);
    context.strokeRect(32, 42, 10, 5);
    context.strokeRect(42, 42, 10, 5);

    context.strokeRect(12, 17, 5, 5);
    context.strokeRect(17, 17, 10, 5);
    context.strokeRect(27, 17, 10, 5);
    context.strokeRect(37, 17, 10, 5);
    context.strokeRect(47, 17, 5, 5);

    context.strokeRect(12, 27, 5, 5);
    context.strokeRect(17, 27, 10, 5);
    context.strokeRect(27, 27, 10, 5);
    context.strokeRect(37, 27, 10, 5);
    context.strokeRect(47, 27, 5, 5);

    context.strokeRect(12, 37, 5, 5);
    context.strokeRect(17, 37, 10, 5);
    context.strokeRect(27, 37, 10, 5);
    context.strokeRect(37, 37, 10, 5);
    context.strokeRect(47, 37, 5, 5);

    context.strokeRect(12, 47, 5, 5);
    context.strokeRect(17, 47, 10, 5);
    context.strokeRect(27, 47, 10, 5);
    context.strokeRect(37, 47, 10, 5);
    context.strokeRect(47, 47, 5, 5);
  }

  DoorDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.strokeRect(20, 12, 24, 40);

    context.beginPath();
    context.arc(38, 32, 3, 0, Math.PI * 2);
    context.stroke();
  }

  WindowDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.strokeRect(12, 12, 20, 40);
    context.strokeRect(32, 12, 20, 40);

    context.beginPath();
    context.moveTo(28, 30);
    context.lineTo(28, 34);
    context.stroke();

    context.beginPath();
    context.moveTo(36, 30);
    context.lineTo(36, 34);
    context.stroke();
  }

  FloorDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(12, 12);
    context.lineTo(12, 50);
    context.lineTo(52, 50);
    context.lineTo(52, 12);
    context.closePath();
    context.stroke();

    context.fillStyle = "#ffffff";
    context.lineWidth = 1;
    context.font = "18px 宋";
    context.textAlign = "center";
    context.fillText("地", 32, 36);
  }


  CeilingDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(12, 12);
    context.lineTo(12, 50);
    context.lineTo(52, 50);
    context.lineTo(52, 12);
    context.closePath();
    context.stroke();

    context.fillStyle = "#ffffff";
    context.lineWidth = 1;
    context.font = "18px 宋";
    context.textAlign = "center";
    context.fillText("天", 32, 36);
  }

  RoomDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(12, 12);
    context.lineTo(12, 50);
    context.lineTo(42, 50);
    context.lineTo(42, 40);
    context.lineTo(52, 40);
    context.lineTo(52, 12);
    context.closePath();
    context.stroke();

    context.fillStyle = "#ffffff";
    context.lineWidth = 1;
    context.font = "18px 宋";
    context.textAlign = "center";
    context.fillText("房", 32, 36);
  }

  StairsDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(10, 10);
    context.lineTo(15, 10);
    context.lineTo(15, 14);
    context.lineTo(20, 14);
    context.lineTo(20, 18);
    context.lineTo(25, 18);
    context.lineTo(25, 22);
    context.lineTo(30, 22);
    context.lineTo(30, 26);
    context.lineTo(35, 26);
    context.lineTo(35, 30);
    context.lineTo(51, 30);
    context.lineTo(35, 30);
    context.lineTo(35, 34);
    context.lineTo(30, 34);
    context.lineTo(30, 38);
    context.lineTo(25, 38);
    context.lineTo(25, 42);
    context.lineTo(20, 42);  
    context.lineTo(20, 46);
    context.lineTo(15, 46);
    context.lineTo(15, 50);
    context.lineTo(10, 50);
    context.stroke();
  }

  RollBackDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(41, 50);
    context.lineTo(41, 16);
    context.lineTo(21, 16);
    context.lineTo(21, 45);
    context.lineTo(17, 40);
    context.lineTo(22, 50);
    context.lineTo(29, 40);
    context.lineTo(23, 45);
    context.lineTo(23, 18);
    context.lineTo(39, 18);
    context.lineTo(39, 50);
    context.closePath();
    context.stroke();
  }

  RollForwardDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(19, 50);
    context.lineTo(19, 16);
    context.lineTo(39, 16);
    context.lineTo(39, 45);
    context.lineTo(43, 40);
    context.lineTo(38, 50);
    context.lineTo(33, 40);
    context.lineTo(37, 45);
    context.lineTo(37, 18);
    context.lineTo(21, 18);
    context.lineTo(21, 50);
    context.closePath();
    context.stroke();
  }

  TestDrawing(context: CanvasRenderingContext2D) {
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1;
    context.font = "46px Arial";
    context.textAlign = "center";
    context.strokeText("T", 15, 50);

    context.font = "30px Arial";
    context.textAlign = "center";
    context.strokeText("est", 40, 50);
  }

  
  TestGridDrawing(context: CanvasRenderingContext2D) {
    
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(5, 10);
    context.lineTo(56, 10);  
    context.stroke();

    context.beginPath();
    context.moveTo(5, 20);
    context.lineTo(56, 20);  
    context.stroke();

    context.beginPath();
    context.moveTo(5, 30);
    context.lineTo(56, 30);  
    context.stroke();

    context.beginPath();
    context.moveTo(5, 40);
    context.lineTo(56, 40);  
    context.stroke();

    context.beginPath();
    context.moveTo(5, 50);
    context.lineTo(56, 50);  
    context.stroke();

    context.beginPath();
    context.moveTo(10, 5);
    context.lineTo(10, 55);  
    context.stroke();

    context.beginPath();
    context.moveTo(20, 5);
    context.lineTo(20, 55);  
    context.stroke();

    context.beginPath();
    context.moveTo(30, 5);
    context.lineTo(30, 55);  
    context.stroke();

    context.beginPath();
    context.moveTo(40, 5);
    context.lineTo(40, 55);  
    context.stroke();

    context.beginPath();
    context.moveTo(50, 5);
    context.lineTo(50, 55);  
    context.stroke();

    context.strokeStyle = "#ffffff";
    context.fillStyle = "#ffffff";
    context.lineWidth = 1;
    context.font = "46px Arial";
    context.textAlign = "center";
    context.strokeText("T", 15, 50);
    context.fillText("T", 15, 50);

    context.font = "30px Arial";
    context.textAlign = "center";
    context.strokeText("est", 40, 50);
    context.fillText("est", 40, 50);
  }
  //#endregion

  //#region 命令
  public  ButtonClick() {
    switch (this.buttonKey) {
      case "测试": MockingOne(); break;     
      case "测试网格": MockingGrid(); break;
      case "直线": RunCommand("Line"); break;
      case "圆弧": RunCommand("Arc"); break;
      case "移动": RunCommand("Move"); break;
      case "镜像": RunCommand("Mirror"); break;
      case "偏移": RunCommand("Offset"); break;
      case "阵列": RunCommand("Array"); break;
      case "墙": RunCommand("Wall"); break;
      case "门": RunCommand("Door"); break;
      case "窗": RunCommand("Window"); break;
      case "地面": RunCommand("Floor"); break;
      case "天花": RunCommand("Ceiling"); break;
      case "房间": RunCommand("Room"); break;
      case "楼梯": RunCommand("Stairs"); break;
      case "网格": MockingGrid(); break;
      case "1楼": MockingOne(); break;
      case "回退": {
        const history = container.resolve<HistoryService>(SetConfigType.HistoryService);
         history.RollBack();
        break;
      };
      case "重复": {
        const history = container.resolve<HistoryService>(SetConfigType.HistoryService);
         history.RollForward();
        break;
      };
      default: break;
    }
  }

  private  BuildingTest() {
    //  ModifyLayer("测试大楼", "1", "1~3,5");
     BuildLayer("测试大楼", "4,6");
     BuildLayer("测试大楼", "7");
  }
  //#endregion
}
