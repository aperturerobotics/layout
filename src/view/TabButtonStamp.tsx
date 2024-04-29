import * as React from "react";
import { TabNode } from "../model/TabNode.js";
import { IconFactory, ILayoutCallbacks, TitleFactory } from "./Layout.js";
import { CLASSES } from "../Types.js";
import { getRenderStateEx } from "./Utils.js";

/** @internal */
export interface ITabButtonStampProps {
    node: TabNode;
    layout: ILayoutCallbacks;
    iconFactory?: IconFactory;
    titleFactory?: TitleFactory;
}

/** @internal */
export const TabButtonStamp = (props: ITabButtonStampProps) => {
    const { layout, node, iconFactory, titleFactory } = props;
    const selfRef = React.useRef<HTMLDivElement | null>(null);

    const cm = layout.getClassName;

    const classNames = cm(CLASSES.FLEXLAYOUT__TAB_BUTTON_STAMP);

    const renderState = getRenderStateEx(layout, node, iconFactory, titleFactory);

    const content = renderState.content ? <div className={cm(CLASSES.FLEXLAYOUT__TAB_BUTTON_CONTENT)}>{renderState.content}</div> : node._getNameForOverflowMenu();

    const leading = renderState.leading ? <div className={cm(CLASSES.FLEXLAYOUT__TAB_BUTTON_LEADING)}>{renderState.leading}</div> : null;

    return (
        <div ref={selfRef} className={classNames} title={node.getHelpText()}>
            {leading}
            {content}
        </div>
    );
};
