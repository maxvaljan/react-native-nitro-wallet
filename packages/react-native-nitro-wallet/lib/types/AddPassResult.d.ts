/**
 * Outcome of an Apple Wallet add-pass presentation.
 *
 * @see {@linkcode AddPassResult.status}
 */
export type AddPassStatus = 'added' | 'cancelled' | 'already-added';
/**
 * Result returned after presenting an Apple Wallet add-pass flow.
 *
 * @see {@linkcode Wallet.addPkPassFromUrl}
 */
export interface AddPassResult {
    /**
     * Final state after the add-pass controller finished.
     */
    status: AddPassStatus;
}
