export enum Config {
    AUTH = "auth.json",
    WATCHER = "watcherFile.json",
};

function getConfigDirPath(): String {
    const configPath = process.env.CONFIG_PATH;
    if (configPath != undefined && configPath != "") {
        return configPath;
    } else {
        return "."
    }
}

export function getConfigPath(config: Config): string {
    console.log("GETTING CONFIG " + `${getConfigDirPath()}/${config}`)
    return `${getConfigDirPath()}/${config}`
}

export async function getConfigJson(config: Config): Promise<Record<string, string>> {
    const configPath = getConfigPath(config);

    try {
        const configObj = await import(configPath);
        return configObj;
    } catch (error) {
        console.error(`Could not find module at ${configPath}`);
        process.exit(5);
    }
}