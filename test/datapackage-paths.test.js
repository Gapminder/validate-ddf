import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { validate } from "../src/index.js";
import { createBadDatapackageFiles } from "./datasets/error-datapackage-path-separators/create-test-files.mjs";

function fixture(t) {
    const directory = createBadDatapackageFiles();
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    return { directory, manifest: join(directory, "datapackage.json") };
}

function cli(directory, mode, ...options) {
    const result = spawnSync(process.execPath, ["src/cli.js", directory, "-m", mode, ...options], {
        cwd: new URL("../", import.meta.url),
        encoding: "utf8",
        timeout: 30000,
    });
    assert.ifError(result.error);
    return result;
}

test("JS API reports backslash separator counts with an actionable error", async t => {
    const { directory, manifest } = fixture(t);
    const before = readFileSync(manifest, "utf8");
    const result = await validate(directory, { onlyErrors: true });
    assert.equal(result.success, null);
    const errors = result.errors.filter(error => !error.isWarning);
    assert.deepEqual(errors.map(error => error.errorCode), ["E_DATAPACKAGE_PATH_SEPARATOR"]);
    assert.equal(errors[0].file, manifest);
    assert.match(errors[0].message, /found 4 backslashes in 3 resource paths/);
    assert.match(errors[0].message, /forward slashes/);
    assert.match(errors[0].message, /validate-ddf --fix/);
    assert.equal(readFileSync(manifest, "utf8"), before);
});

for (const mode of ["filenames", "datapackage"]) {
    test(`${mode}: detects Windows separators without misleading missing-file errors`, t => {
        const { directory, manifest } = fixture(t);
        const before = readFileSync(manifest, "utf8");
        const result = cli(directory, mode);
        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /E_DATAPACKAGE_PATH_SEPARATOR/);
        assert.match(result.stdout, /found 4 backslashes in 3 resource paths/);
        assert.match(result.stdout, /validate-ddf --fix/);
        assert.doesNotMatch(result.stdout, /E_DATAPACKAGE_RESOURCE_MISSING/);
        assert.equal(readFileSync(manifest, "utf8"), before);
    });

    test(`${mode}: --fix repairs paths, preserves metadata, and passes revalidation`, t => {
        const { directory, manifest } = fixture(t);
        const expected = JSON.parse(readFileSync(manifest, "utf8"));
        for (const resource of expected.resources) {
            resource.path = resource.path.replace(/\\/g, "/");
        }
        const fixed = cli(directory, mode, "--fix");
        assert.equal(fixed.status, 0, fixed.stdout + fixed.stderr);
        assert.match(fixed.stdout, /Dataset is valid/);
        assert.doesNotMatch(fixed.stdout, /E_DATAPACKAGE_PATH_SEPARATOR/);
        const fixedContent = readFileSync(manifest, "utf8");
        const actual = JSON.parse(fixedContent);
        assert.deepEqual(actual, expected);
        assert.deepEqual(actual.resources.map(resource => resource.path), [
            "concepts/ddf--concepts.csv",
            "entities/geo/ddf--entities--geo--country.csv",
            "data/ddf--datapoints/ddf--datapoints--population--by--geo--year.csv",
        ]);
        for (const resource of actual.resources) {
            assert.ok(existsSync(join(directory, resource.path)), resource.path);
        }
        const revalidated = cli(directory, mode);
        assert.equal(revalidated.status, 0, revalidated.stdout + revalidated.stderr);
        const fixedAgain = cli(directory, mode, "--fix");
        assert.equal(fixedAgain.status, 0, fixedAgain.stdout + fixedAgain.stderr);
        assert.equal(readFileSync(manifest, "utf8"), fixedContent);
    });

    test(`${mode}: --fix leaves malformed JSON unchanged`, t => {
        const { directory, manifest } = fixture(t);
        const malformed = readFileSync(manifest, "utf8") + "invalid JSON";
        writeFileSync(manifest, malformed);
        const result = cli(directory, mode, "--fix");
        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /E_DATAPACKAGE_PARSE_ERROR/);
        assert.equal(readFileSync(manifest, "utf8"), malformed);
    });

    test(`${mode}: --fix leaves invalid resource structures unchanged`, t => {
        const { directory, manifest } = fixture(t);
        const datapackage = JSON.parse(readFileSync(manifest, "utf8"));
        delete datapackage.resources[0].schema;
        const content = JSON.stringify(datapackage);
        writeFileSync(manifest, content);
        const result = cli(directory, mode, "--fix");
        assert.equal(result.status, 1, result.stdout + result.stderr);
        assert.match(result.stdout, /E_DATAPACKAGE_PARSE_ERROR/);
        assert.equal(readFileSync(manifest, "utf8"), content);
    });
}
