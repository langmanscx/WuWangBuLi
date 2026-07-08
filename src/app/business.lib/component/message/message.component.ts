import { AfterViewInit, Component } from '@angular/core';
import { ICommand } from 'src/app/core.lib/controller/command/i.command';
import { CommandService } from 'src/app/core.lib/service/command/command.service';
import { InputService } from 'src/app/core.lib/service/interactive/input.service';
import { SetConfigType } from 'src/app/core.lib/set.config.type';
import { DependencyContainer, container } from 'tsyringe';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less']
})
export class MessageComponent implements AfterViewInit {

  public Command?: ICommand = undefined;

  public get Placeholder() {
    return this.Command ? "更改输入Ctrl+序号" : "输入命令";
  };

  public CurrentInput: string = "";

  constructor() {
    // this.Message = new CommandMessage();
  }

  ngAfterViewInit() {
    const commandService = container.resolve<CommandService>(SetConfigType.CommandService);
    commandService.CommandObservable.subscribe(x => {
      this.Command = x;
    });
  }

  OnKey(event: KeyboardEvent) {

    const commandService = container.resolve<CommandService>(SetConfigType.CommandService);
    const list = container.resolve<string[]>(SetConfigType.ScopeTokenList);

    if (event.ctrlKey) {
      if (event.code.includes("Digit") || event.code.includes("Numpad")) {
        const code = event.code.replace("Digit", "").replace("Numpad", "");
        if (code === "0")
          return;

        const i = parseInt(code) - 1;
        commandService.CurrentCommande?.ActivateStep(i);
      }
      this.CurrentInput = "";
    }
    else if (event.key === "Enter" || event.key === " ") {

      for (const item of list) {

        const child = container.resolve<DependencyContainer>(item);
        if (child.isRegistered(SetConfigType.InputService)) {
          const service = child.resolve<InputService>(SetConfigType.InputService);

          service.OnNumberInput(this.CurrentInput);
          service.OnPointInput(this.CurrentInput);
          this.CurrentInput = "";
        }
      }
    }
  }
}
