/**
 * Generate a valid dataset with deliberately broken datapackage resource paths.
 * Uses temporary files so fixing the dataset never changes tracked fixtures.
 * Run: node test/datasets/error-datapackage-path-separators/create-test-files.mjs
 */
import { cpSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function createBadDatapackageFiles() {
    const directory = mkdtempSync(join(tmpdir(), "validate-ddf-paths-"));
    cpSync(new URL("../valid-minimal/", import.meta.url), directory, { recursive: true });
    const datapackagePath = join(directory, "datapackage.json");
    const datapackage = JSON.parse(readFileSync(datapackagePath, "utf8"));
    const folders = ["concepts", "entities/geo", "data/ddf--datapoints"];
    const brokenFolders = ["concepts\\", "entities\\geo\\", "data/ddf--datapoints\\"];

    datapackage.resources.forEach((resource, i) => {
        const filename = resource.path;
        mkdirSync(join(directory, folders[i]), { recursive: true });
        renameSync(join(directory, filename), join(directory, folders[i], filename));
        resource.path = brokenFolders[i] + filename;
        resource.custom = { path: "metadata\\must\\\\stay", note: "Keep custom resource metadata" };
    });
    datapackage.description = "Backslashes outside resource paths: C:\\data\\\\notes";
    datapackage.custom = { path: "Keep\\this\\\\too", url: "https://example.org/data" };
    writeFileSync(datapackagePath, JSON.stringify(datapackage, null, 4) + "\n");
    return directory;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    console.log(createBadDatapackageFiles());
}
