//@ts-check
import { syncPackageJsonDeps } from './lib/sync.mjs';
import { Command } from 'commander';
import path from 'path';
const program = new Command();

program
  .name('sync-package-json')
  .description(
    'Find all missing dependencies in target and match against declared dependencies in the source package.json'
  )
  .version('0.0.1');

program
  .command('sync')
  .description('Sync missing dependencies')
  .argument(
    '<source>',
    'Path of source package.json that will be used for comparison'
  )
  .argument('<target>', 'Path of target package.json that will be updated')
  .action(async (source, target) => {
    const sourcePath = path.resolve(process.cwd(), path.dirname(source));
    const targetPath = path.resolve(process.cwd(), path.dirname(target));

    await syncPackageJsonDeps(sourcePath, targetPath);
  });

program.parse();
