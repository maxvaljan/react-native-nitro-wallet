import type { GoogleWalletPassFormat } from './GoogleWalletPassFormat';
/**
 * Options for starting a Google Wallet save flow.
 *
 * @see {@linkcode Wallet.saveGoogleWalletPass}
 */
export interface SaveGoogleWalletPassOptions {
    /**
     * Encoding format of {@linkcode value}.
     */
    format: GoogleWalletPassFormat;
    /**
     * JWT or JSON payload accepted by the Google Wallet Android SDK.
     */
    value: string;
}
