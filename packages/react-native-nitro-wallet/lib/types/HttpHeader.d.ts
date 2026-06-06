/**
 * Represents one HTTP header used when fetching a pass file.
 *
 * @see {@linkcode AddPkPassFromUrlOptions.headers}
 */
export interface HttpHeader {
    /**
     * Header field name.
     */
    name: string;
    /**
     * Header field value.
     */
    value: string;
}
