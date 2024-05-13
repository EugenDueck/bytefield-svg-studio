declare module 'bytefield-svg' {
    interface GenerateOptions {
        embedded?: boolean;
    }

    /**
     * Generates an SVG diagram from a DSL source string.
     * @param source The diagram description in DSL format.
     * @param options Optional parameters to customize the output.
     * @returns The generated SVG diagram as a string.
     */
    function generate(source: string, options?: GenerateOptions): string;

    export = generate;
}
