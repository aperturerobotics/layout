import * as React from "react";
import { TabNode } from "../model/TabNode.js";
import { ILayoutCallbacks } from "./Layout.js";
import { ErrorBoundary } from "./ErrorBoundary.js";
import { I18nLabel } from "../I18nLabel.js";
import { Fragment } from "react";
import { CLASSES } from "../Types.js";

/** @internal */
export interface IFloatingWindowTabProps {
    layout: ILayoutCallbacks;
    node: TabNode;
    factory: (node: TabNode) => React.ReactNode;
}

/** @internal */
export const FloatingWindowTab = (props: IFloatingWindowTabProps) => {
    const { layout, node, factory } = props;
    const cm = layout.getClassName;
    const child = factory(node);

    return (
        <div className={cm(CLASSES.FLEXLAYOUT__FLOATING_WINDOW_TAB)}>
            <ErrorBoundary message={props.layout.i18nName(I18nLabel.Error_rendering_component)}>
                <Fragment>{child}</Fragment>
            </ErrorBoundary>
        </div>
    );
};
