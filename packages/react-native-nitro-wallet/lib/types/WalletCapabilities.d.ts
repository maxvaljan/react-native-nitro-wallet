import type { WalletProvider } from './WalletProvider';
/**
 * Describes the wallet workflows currently available on the device.
 *
 * @see {@linkcode Wallet.getCapabilities}
 */
export interface WalletCapabilities {
    /**
     * Wallet providers that this native platform can target.
     */
    supportedProviders: WalletProvider[];
    /**
     * Whether the current device can present a native add-pass flow.
     */
    canAddPasses: boolean;
    /**
     * Whether Apple `.pkpass` files can be parsed and added.
     */
    canAddPkPasses: boolean;
    /**
     * Whether Google Wallet save flows can be started for pass JWT or JSON payloads.
     */
    canSaveGoogleWalletPasses: boolean;
    /**
     * Whether passes can be queried by pass type identifier and serial number.
     */
    canQueryPasses: boolean;
    /**
     * Whether matching passes can be opened in the native wallet app.
     */
    canOpenPasses: boolean;
    /**
     * Whether matching passes can be removed from the native wallet app.
     */
    canRemovePasses: boolean;
}
