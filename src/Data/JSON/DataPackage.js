// Called only after the resource structure has been parsed successfully.
// Work on decoded JSON strings so JSON escapes are not mistaken for separators.
export const normalizeResourcePaths = content => {
    const datapackage = JSON.parse(content);
    let backslashes = 0;
    let affectedPaths = 0;

    for (const resource of datapackage.resources) {
        let changed = false;
        resource.path = resource.path.replace(/\\/g, () => {
            backslashes++;
            changed = true;
            return "/";
        });
        if (changed) affectedPaths++;
    }

    return {
        backslashes,
        affectedPaths,
        content: affectedPaths === 0 ? content : JSON.stringify(datapackage, null, 4) + "\n",
    };
};
