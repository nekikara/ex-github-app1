import {CommandLineChoiceParameter, CommandLineParser, CommandLineStringParameter} from "@rushstack/ts-command-line";
import { deploy } from './deploy'

export class Cmd extends CommandLineParser {
  private _branchName: CommandLineStringParameter
  private _environment: CommandLineChoiceParameter

  public constructor() {
    super({
      toolFilename: 'deploy',
      toolDescription: 'The "deploy" tool is a deployment helper tool.'
    });
  }

  protected onDefineParameters() {
    const option = {
      require: true,
      parameterLongName: '--branch-name',
      parameterShortName: '-b',
      environmentVariable: 'CLI_BRANCH_NAME',
      defaultValue: 'master',
      description: 'Specify a branch name you want to deploy',
      argumentName: 'BRANCH',
    }
    this._branchName = this.defineStringParameter(option)

    const caseOption = {
      require: true,
      parameterLongName: '--environment',
      parameterShortName: '-e',
      description: 'Specify an environment you want to deploy',
      environmentVariable: 'CLI_ENVIRONMENT',
      alternatives: ['staging', 'production'],
      defaultValue: 'staging',
    }
    this._environment = this.defineChoiceParameter(caseOption)
  }

  protected onExecute(): Promise<void> {
    return deploy(this._branchName, this._environment);
  }
}
