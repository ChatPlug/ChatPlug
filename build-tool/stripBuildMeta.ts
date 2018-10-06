/**
 * A webpack loader used to remove some trash left by ts-loader so that chatplug.lib.manifest.json isn't over 1MB big.
 */
export default function stripBuildMeta(content) {
  delete this._module.buildMeta.tsLoaderDefinitionFileVersions;
  return content
}
