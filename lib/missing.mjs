//@ts-check

import depcheck from 'depcheck';

/**
 * @param {string} path Path of source files to crawl for missing dependencies
 * @returns {Promise<Array<{package: string, files: string[]}>>}
 */
export async function findMissingDeps(path) {
  const result = await depcheck(path, {
    ignoreBinPackage: false,
    skipMissing: false,
    ignorePatterns: ['dist'],
    ignoreMatches: [],
    parsers: {
      // the target parsers
      '**/*.js': depcheck.parser.es6,
      '**/*.jsx': depcheck.parser.jsx,
      '**/*.mjs': depcheck.parser.es6,
    },
    detectors: [
      // the target detectors
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration,
    ],
    specials: [
      // the target special parsers
      depcheck.special.eslint,
      depcheck.special.webpack,
    ],
  });

  return Object.entries(result.missing).map(([key, value]) => ({
    package: key,
    files: value,
  }));
}

/**
 * @param {Array<{package: string, files: string[]}>} missingDeps
 * @param {Array<{package: string, version: string}>} sourceDeps
 */
export function mergeDeps(missingDeps, sourceDeps) {
  const missingDepsWithVersion = [];

  for (const missingDep of missingDeps) {
    let match = sourceDeps.find(
      (/** @type {{ package: string; }} */ d) =>
        d.package === missingDep.package
    );

    if (match?.version)
      missingDepsWithVersion.push({
        package: missingDep.package,
        version: match.version,
      });
  }

  return missingDepsWithVersion.sort((a, b) =>
    a.package.localeCompare(b.package)
  );
}
