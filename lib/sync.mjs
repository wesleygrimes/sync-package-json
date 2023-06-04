//@ts-check
import packageJson from '@npmcli/package-json';

import { findMissingDeps, mergeDeps } from './missing.mjs';
import { convertDepsToArray } from './deps.mjs';

/**
 * @param {string} source Path to source package.json that will be used for comparison
 * @param {string} target Path of target package.json that will be updated
 */
export async function syncPackageJsonDeps(source, target) {
  const sourcePackageJson = await packageJson.load(source);
  const targetPackageJson = await packageJson.load(target);

  const missing = await findMissingDeps(target);

  const sourceDeps = convertDepsToArray(sourcePackageJson.content.dependencies);
  const targetDeps = convertDepsToArray(targetPackageJson.content.dependencies);

  const mergedDeps = mergeDeps(missing, sourceDeps);

  targetDeps.forEach((d) => {
    if (d.version === '*') {
      const found = sourceDeps.find((wd) => wd.package === d.package);
      if (found) d.version = found.version;
    }
  });

  const syncedPackageDeps = [...mergedDeps, ...targetDeps].sort((a, b) =>
    a.package.localeCompare(b.package)
  );

  targetPackageJson.update({
    dependencies: Object.fromEntries(
      syncedPackageDeps.map((e) => [e.package, `${e.version}`])
    ),
  });

  await targetPackageJson.save();
}
