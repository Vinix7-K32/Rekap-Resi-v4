import packageJson from "../../package.json";

const APP_NAME = "Rekap Resi";

export function getAppInfo() {
  return {
    name: APP_NAME,
    packageName: packageJson.name ?? APP_NAME,
    version: packageJson.version ?? "0.0.0",
  };
}
