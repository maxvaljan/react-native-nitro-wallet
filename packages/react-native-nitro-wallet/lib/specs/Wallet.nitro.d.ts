import type { HybridObject } from 'react-native-nitro-modules';
import type { AddPassResult } from '../types/AddPassResult';
import type { AddPkPassFromBase64Options } from '../types/AddPkPassFromBase64Options';
import type { AddPkPassFromUrlOptions } from '../types/AddPkPassFromUrlOptions';
import type { SaveGoogleWalletPassOptions } from '../types/SaveGoogleWalletPassOptions';
import type { SaveGoogleWalletPassResult } from '../types/SaveGoogleWalletPassResult';
import type { WalletCapabilities } from '../types/WalletCapabilities';
import type { WalletPassIdentifier } from '../types/WalletPassIdentifier';
import type { WalletProvider } from '../types/WalletProvider';
/**
 * Provides native wallet management for Apple Wallet passes and Google Wallet save flows.
 *
 * @see {@linkcode Wallet.getCapabilities}
 */
export interface Wallet extends HybridObject<{
    ios: 'swift';
    android: 'kotlin';
}> {
    /**
     * Resolves the wallet workflows available on the current device.
     */
    getCapabilities(): Promise<WalletCapabilities>;
    /**
     * Returns whether the current device can start an add-pass flow for the provider.
     */
    canAddPasses(provider: WalletProvider): Promise<boolean>;
    /**
     * Downloads an Apple Wallet `.pkpass` file and presents the native add-pass UI.
     *
     * @throws If the platform does not support `.pkpass` files, the URL is invalid,
     * the pass cannot be downloaded, or the pass data is invalid.
     */
    addPkPassFromUrl(options: AddPkPassFromUrlOptions): Promise<AddPassResult>;
    /**
     * Presents the native add-pass UI for a base64-encoded Apple Wallet `.pkpass` file.
     *
     * @throws If the platform does not support `.pkpass` files or the pass data is invalid.
     */
    addPkPassFromBase64(options: AddPkPassFromBase64Options): Promise<AddPassResult>;
    /**
     * Starts a Google Wallet save flow for a pass JWT or JSON payload.
     *
     * @throws If Google Wallet saving is unavailable, the platform is unsupported,
     * there is no active Android Activity, or Google Wallet reports a save error.
     */
    saveGoogleWalletPass(options: SaveGoogleWalletPassOptions): Promise<SaveGoogleWalletPassResult>;
    /**
     * Returns whether a matching pass exists in the local pass library.
     *
     * @throws If the current platform cannot query local wallet passes.
     */
    hasPass(identifier: WalletPassIdentifier): Promise<boolean>;
    /**
     * Opens a matching pass in the native wallet app.
     *
     * This is best-effort and resolves with the result reported by the native open URL API.
     *
     * @returns `false` when no matching pass is available to open.
     * @throws If the current platform cannot open local wallet passes.
     */
    openPass(identifier: WalletPassIdentifier): Promise<boolean>;
    /**
     * Removes a matching pass from the local pass library.
     *
     * This is best-effort. PassKit may ignore the request when the app cannot access or manage
     * the matching pass, even after this method has handed the pass to the native library.
     *
     * @returns `false` when no matching pass is available to remove.
     * @throws If the current platform cannot remove local wallet passes.
     */
    removePass(identifier: WalletPassIdentifier): Promise<boolean>;
}
