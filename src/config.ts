import { WorkspaceConfiguration } from 'vscode';

export interface Config {
    eyamlPath: string;
    recipients: string;
}

abstract class ConfigImpl implements Config {
    eyamlPath: string;
    recipients: string;

    constructor(protected rawConfig: WorkspaceConfiguration) {
        this.loadAndValidate();
        // TODO: ensure this calls the overriden method
    }

    protected loadAndValidate(): void {
        this.eyamlPath = this.rawConfig.eyamlPath;
    }
}

export enum OutputFormat {
    String
}

export enum recipients {
    String
}
export interface EncryptConfig extends Config {
    outputFormat: OutputFormat;
}

export class EncryptConfigImpl extends ConfigImpl implements EncryptConfig {
    eyamlPath: string;
    outputFormat: OutputFormat;
    recipients: string;

    loadAndValidate(): void {
        super.loadAndValidate();
        this.outputFormat = OutputFormat[<string>this.rawConfig.outputFormat];
    }
}

export interface DecryptConfig extends Config {
}

export class DecryptConfigImpl extends ConfigImpl implements DecryptConfig {
    eyamlPath: string;

    loadAndValidate(): void {
        super.loadAndValidate();
    }
}