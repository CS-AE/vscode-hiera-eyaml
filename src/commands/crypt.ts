import { WorkspaceConfiguration } from 'vscode';
import * as config from '../config';
import * as exec from './exec';

export namespace commands {

    export enum CryptKind {
        Encrypt,
        Decrypt
    }

    export interface CryptCommand {
        execute(input: string): Promise<string>;
        prepareOutput(output: string): string;
    }

    export function getInstance(cryptKind: CryptKind, rawConfig: WorkspaceConfiguration, execCommand: exec.commands.ExecCommand): CryptCommand {
        switch (cryptKind) {
            case CryptKind.Decrypt:
                const decryptConfig = new config.DecryptConfigImpl(rawConfig);
                decryptConfig.loadAndValidate();
                return new DecryptCommand(decryptConfig, execCommand);
            case CryptKind.Encrypt:
                const encryptConfig = new config.EncryptConfigImpl(rawConfig);
                encryptConfig.loadAndValidate();
                return new EncryptCommand(encryptConfig, execCommand);
        }
    }

    abstract class CryptCommandImpl implements CryptCommand {
        constructor(
            protected readonly currentConfig: config.Config,
            protected readonly execCommand: exec.commands.ExecCommand
        ) { }

        protected abstract buildExecString(): string;

        protected prepareInput(input: string): string {
            return input;
        }

        public prepareOutput(output: string): string {
            return output.trim();
        }

        public execute(input: string): Promise<string> {
            const execString = this.buildExecString();
            const preparedInput = this.prepareInput(input);
            return this.execCommand.execute(execString, preparedInput);
        }
    }

    class DecryptCommand extends CryptCommandImpl {
        constructor(
            protected readonly currentConfig: config.DecryptConfig,
            protected readonly execCommand: exec.commands.ExecCommand
        ) {
            super(currentConfig, execCommand);
        }

        protected buildExecString(): string {
            return `${this.currentConfig.eyamlPath} decrypt -n gpg --stdin --gpg-always-trust"`;
        }

        protected prepareInput(input: string): string {
            return input.replace(/\r?\n|\r|[ ]/g, "");
        }
    }

    class EncryptCommand extends CryptCommandImpl {
        constructor(
            protected readonly currentConfig: config.EncryptConfig,
            protected readonly execCommand: exec.commands.ExecCommand
        ) {
            super(currentConfig, execCommand);
        }

        protected buildExecString(): string {
            return `${this.currentConfig.eyamlPath} encrypt --output=${this.currentConfig.outputFormat} --stdin --gpg-recipients=${this.currentConfig.recipients} --gpg-always-trust"`;
        }

        public prepareOutput(output: string): string {
            return super.prepareOutput(output);
        }
    }
}