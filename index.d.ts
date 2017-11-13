declare module "bugsnag-react-native" {
    export class Client {
        config: Configuration

        constructor(apiKeyOrConfig: string | Configuration)

        /**
         * Sends an error report to Bugsnag
         * @param error               The error instance to report
         * @param beforeSendCallback  A callback invoked before the report is sent
         *                            so additional information can be added
         * @param blocking            When true, blocks the native thread execution
         *                            until complete. If unspecified, sends the
         *                            request asynchronously
         * @param postSendCallback    Callback invoked after request is queued
         */
        notify(
            error: Error,
            beforeSendCallback: (report: Report) => void,
            blocking?: boolean,
            postSendCallback?: (sent: boolean) => void
        ): void

        setUser(id: string, name: string, email: string): void

        /**
         * Clear custom user data and reset to the default device identifier
         */
        clearUser(): void

        /**
         * Leaves a 'breadcrumb' log message. The most recent breadcrumbs
         * are attached to subsequent error reports.
         */
        leaveBreadcrumb(name: string, metadata?: Metadata | string): void
    }
    /**
     * Configuration options for a Bugsnag client
     */
    export class Configuration {
        version: string
        apiKey?: string
        delivery: StandardDelivery
        beforeSendCallbacks: ((report: Report) => boolean)[]
        notifyReleaseStages?: string[]
        releaseStage?: string
        appVersion?: string
        codeBundleId?: string
        autoNotify: boolean
        handlePromiseRejections: boolean

        constructor(apiKey?: string)

        /**
         * Whether reports should be sent to Bugsnag, based on the release stage
         * configuration
         */
        shouldNotify(): boolean

        /**
         * Adds a function which is invoked after an error is reported but before
         * it is sent to Bugsnag. The function takes a single parameter which is
         * an instance of Report.
         */
        registerBeforeSendCallback(callback: (report: Report) => boolean): void

        /**
         * Remove a callback from the before-send pipeline
         */
        unregisterBeforeSendCallback(
            callback: (report: Report) => boolean
        ): void

        /**
         * Remove all callbacks invoked before reports are sent to Bugsnag
         */
        clearBeforeSendCallbacks(): void

        toJSON(): any
    }

    export class StandardDelivery {
        endpoint: string

        constructor(endpoint: string)
    }

    export interface Metadata {
        type?:
            | "error"
            | "log"
            | "navigation"
            | "process"
            | "request"
            | "state"
            | "user"
            | "manual"
        [key: string]: MetadataValue | string | number | boolean
    }

    export interface MetadataValue {
        [key: string]: string | number | boolean
    }

    /**
     * A report generated from an error
     */
    export class Report {
        apiKey: string
        errorClass: string
        errorMessage: string
        context?: string
        groupingHash?: string
        metadata: Metadata
        severity: "warning" | "error" | "info"
        stacktrace: string
        user: any

        constructor(apiKey: string, error: Error)

        /**
         * Attach additional diagnostic data to the report. The key/value pairs
         * are grouped into sections.
         */
        addMetadata(
            section: string,
            key: string,
            value: number | string | boolean
        ): void

        toJSON(): any
    }
}
