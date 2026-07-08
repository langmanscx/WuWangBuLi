import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-button-list',
  templateUrl: './buttonlist.component.html',
  styleUrls: ['./buttonlist.component.css']
})
export class ButtonListComponent implements AfterViewInit {

  public Buttons: string[] = [
    "测试", "测试网格", "直线", "圆弧", "移动", "镜像", "阵列",
    "墙", "门", "窗", "地面", "天花", "房间", "楼梯",
    "回退", "重复"
  ];

  /**
   * 折叠
   */
  public Flod = false;

  /**
   * 计时器Id
   */
  private intervalId?: any;

  private isInButton = false;

  ngAfterViewInit(): void {
  }

  OnOver(): void {
    if (!this.isInButton) {
      this.intervalId = setInterval(() => {
        this.Flod = !this.Flod;
      }, 1200);
    }
  }

  OnOut(): void {
    if (this.intervalId)
      clearInterval(this.intervalId);

    this.isInButton = false;
  }

  OnButtonOver(): void {
    if (this.intervalId)
      clearInterval(this.intervalId);

    this.isInButton = true;
  }

  OnButtonOut(): void {
    this.isInButton = false
  }
}
