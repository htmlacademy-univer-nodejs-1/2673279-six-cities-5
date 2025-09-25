import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};
  private readonly defaultCommand: string = '--help';

  public registerCommands(commandList: Command[]): void {
    for (const command of commandList) {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered.`);
      }
      this.commands[command.getName()] = command;
    }
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    try {
      await command.execute(...commandArguments);
    } catch (error) {
      console.error('An error occurred while executing the command:');
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
