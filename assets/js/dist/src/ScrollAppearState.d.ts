export declare enum ScrollAppearState {
    UNINITIALISED = "uninitialised",
    HIDDEN = "hidden",
    APPEARING = "appearing",
    VISIBLE = "visible"
}
export declare function isScrollAppearState(val: unknown): val is ScrollAppearState;
