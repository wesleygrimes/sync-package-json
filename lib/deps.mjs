//@ts-check
/**
 * @param {import("@npmcli/package-json").Content['dependencies']} deps
 */
export function convertDepsToArray(deps) {
  return (
    Object.entries(deps || {})
      .map(([key, value]) => ({
        package: key,
        version: value,
      }))
      .sort((a, b) => a.package.localeCompare(b.package)) || []
  );
}
