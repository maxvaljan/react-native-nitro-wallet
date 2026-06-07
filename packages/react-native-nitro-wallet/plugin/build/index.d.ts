import { type ConfigPlugin } from 'expo/config-plugins';
/**
 * Options for the `@maxvaljan/react-native-nitro-wallet-manager` Expo config plugin.
 */
export interface NitroWalletPluginOptions {
    /**
     * Apple pass type identifiers to declare in the iOS entitlements, e.g.
     * `['pass.com.example.ticket']` or `['$(TeamIdentifierPrefix)*']`.
     *
     * Only required for issuer/associated-pass features. The standard add-pass
     * flow (`addPkPassFromUrl` / `addPkPassFromBase64`) needs no entitlement, so
     * this can be omitted entirely.
     */
    passTypeIdentifiers?: string[];
}
declare const _default: ConfigPlugin<void | NitroWalletPluginOptions>;
export default _default;
