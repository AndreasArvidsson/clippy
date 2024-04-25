export interface Request {
    /**
     * A uuid that will be written to the response file for sanity checking
     * client-side
     */
    uuid: string;

    /** The data payload */
    data: unknown;

    /**
     * A boolean indicating if we should return the output of the command
     */
    returnCommandOutput: boolean;

    /**
     * A boolean indicating if we should await the command to ensure it is
     * complete.  This behaviour is desirable for some commands and not others.
     * For most commands it is ok, and can remove race conditions, but for
     * some commands, such as ones that show a quick picker, it can hang the
     * client
     */
    waitForFinish: boolean;
}

export interface Response {
    /**
     * The uuid passed into the response for sanity checking client-side
     */
    uuid: string;

    /**
     * The return value of the command, if requested.
     */
    returnValue?: unknown;

    /**
     * Any error encountered or null if successful
     */
    error: string | null;

    /**
     * A list of warnings issued when running the command
     */
    warnings: string[];
}
