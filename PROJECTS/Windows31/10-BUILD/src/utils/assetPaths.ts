import type { AssetSpec } from '../assets/assetManifest';

export function getAssetUrl(asset: AssetSpec) {
  return `./${asset.runtimeImportPath}`;
}
