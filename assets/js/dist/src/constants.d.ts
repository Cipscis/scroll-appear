export declare enum ScrollAppearState {
    HIDDEN = "hidden",
    VISIBLE = "visible"
}
export declare const dataAttributes: {
    readonly state: "data-scroll-appear-state";
    readonly delay: "data-scroll-appear-delay";
};
export declare const selectors: {
    readonly uninitialised: ".js-scroll-appear:not([data-scroll-appear-state])";
    readonly hidden: ".js-scroll-appear[data-scroll-appear-state=\"hidden\"]";
    readonly visible: ".js-scroll-appear[data-scroll-appear-state=\"visible\"]";
};
