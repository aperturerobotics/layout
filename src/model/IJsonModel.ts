import { ICloseType } from "./ICloseType";
export type IBorderLocation = "top" | "bottom" | "left" | "right";
export type ITabLocation = "top" | "bottom";
export type IInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export interface IJsonModel {
    global?: IGlobalAttributes;
    borders?: IJsonBorderNode[];
    layout: IJsonRowNode; // top level 'row' is horizontal, rows inside rows take opposite orientation to parent row (ie can act as columns)
}

export interface IJsonBorderNode extends IBorderAttributes {
    location: IBorderLocation;
    children: IJsonTabNode[];
}

export interface IJsonRowNode extends IRowAttributes {
    children: (IJsonRowNode | IJsonTabSetNode)[];
}

export interface IJsonTabSetNode extends ITabSetAttributes {
    active?: boolean; // default: false - only one tabset can be active
    maximized?: boolean; // default: false - only one tabset can be maximized
    children: IJsonTabNode[];
}

export interface IJsonTabNode extends ITabAttributes {}

//----------------------------------------------------------------------------------------------------------
// below this line is autogenerated from attributes in code via Model static method toTypescriptInterfaces()
//----------------------------------------------------------------------------------------------------------
export interface IGlobalAttributes {
    borderAutoSelectTabWhenClosed?: boolean; // default: false
    borderAutoSelectTabWhenOpen?: boolean; // default: true
    borderBarSize?: number; // default: 0
    borderClassName?: string;
    borderEnableAutoHide?: boolean; // default: false
    borderEnableDrop?: boolean; // default: true
    borderMinSize?: number; // default: 0
    borderSize?: number; // default: 200
    enableEdgeDock?: boolean; // default: true
    enableRotateBorderIcons?: boolean; // default: true
    enableUseVisibility?: boolean; // default: false
    legacyOverflowMenu?: boolean; // default: false
    marginInsets?: IInsets; // default: {"top":0,"right":0,"bottom":0,"left":0}
    rootOrientationVertical?: boolean; // default: false
    splitterExtra?: number; // default: 0
    splitterSize?: number; // default: -1
    tabBorderHeight?: number; // default: -1
    tabBorderWidth?: number; // default: -1
    tabClassName?: string;
    tabCloseType?: ICloseType; // default: 1
    tabContentClassName?: string;
    tabDragSpeed?: number; // default: 0.3
    tabEnableClose?: boolean; // default: true
    tabEnableDrag?: boolean; // default: true
    tabEnableFloat?: boolean; // default: false
    tabEnableRename?: boolean; // default: true
    tabEnableRenderOnDemand?: boolean; // default: true
    tabIcon?: string;
    tabSetAutoSelectTab?: boolean; // default: true
    tabSetBorderInsets?: IInsets; // default: {"top":0,"right":0,"bottom":0,"left":0}
    tabSetClassNameHeader?: string;
    tabSetClassNameTabStrip?: string;
    tabSetEnableClose?: boolean; // default: false
    tabSetEnableDeleteWhenEmpty?: boolean; // default: true
    tabSetEnableDivide?: boolean; // default: true
    tabSetEnableDrag?: boolean; // default: true
    tabSetEnableDrop?: boolean; // default: true
    tabSetEnableMaximize?: boolean; // default: true
    tabSetEnableSingleTabStretch?: boolean; // default: false
    tabSetEnableTabStrip?: boolean; // default: true
    tabSetHeaderHeight?: number; // default: 0
    tabSetMarginInsets?: IInsets; // default: {"top":0,"right":0,"bottom":0,"left":0}
    tabSetMinHeight?: number; // default: 0
    tabSetMinWidth?: number; // default: 0
    tabSetTabLocation?: ITabLocation; // default: "top"
    tabSetTabStripHeight?: number; // default: 0
}
export interface IRowAttributes {
    height?: number;
    id?: string;
    type: "row";
    weight?: number; // default: 100
    width?: number;
}
export interface ITabSetAttributes {
    autoSelectTab?: boolean; // default: true - inherited from global tabSetAutoSelectTab
    borderInsets?: IInsets; // default: {"top":0,"right":0,"bottom":0,"left":0} - inherited from global tabSetBorderInsets
    classNameHeader?: string; //  - inherited from global tabSetClassNameHeader
    classNameTabStrip?: string; //  - inherited from global tabSetClassNameTabStrip
    config?: any;
    enableClose?: boolean; // default: false - inherited from global tabSetEnableClose
    enableDeleteWhenEmpty?: boolean; // default: true - inherited from global tabSetEnableDeleteWhenEmpty
    enableDivide?: boolean; // default: true - inherited from global tabSetEnableDivide
    enableDrag?: boolean; // default: true - inherited from global tabSetEnableDrag
    enableDrop?: boolean; // default: true - inherited from global tabSetEnableDrop
    enableMaximize?: boolean; // default: true - inherited from global tabSetEnableMaximize
    enableSingleTabStretch?: boolean; // default: false - inherited from global tabSetEnableSingleTabStretch
    enableTabStrip?: boolean; // default: true - inherited from global tabSetEnableTabStrip
    headerHeight?: number; // default: 0 - inherited from global tabSetHeaderHeight
    height?: number;
    id?: string;
    marginInsets?: IInsets; // default: {"top":0,"right":0,"bottom":0,"left":0} - inherited from global tabSetMarginInsets
    minHeight?: number; // default: 0 - inherited from global tabSetMinHeight
    minWidth?: number; // default: 0 - inherited from global tabSetMinWidth
    name?: string;
    selected?: number; // default: 0
    tabLocation?: ITabLocation; // default: "top" - inherited from global tabSetTabLocation
    tabStripHeight?: number; // default: 0 - inherited from global tabSetTabStripHeight
    type: "tabset";
    weight?: number; // default: 100
    width?: number;

    // special attributes are read from initial json but must subseqently be set on the model
    maximized?: boolean; // default false
    active?: boolean; // default false
}
export interface ITabAttributes {
    altName?: string;
    borderHeight?: number; // default: -1 - inherited from global tabBorderHeight
    borderWidth?: number; // default: -1 - inherited from global tabBorderWidth
    className?: string; //  - inherited from global tabClassName
    closeType?: ICloseType; // default: 1 - inherited from global tabCloseType
    component?: string;
    config?: any;
    contentClassName?: string; //  - inherited from global tabContentClassName
    enableClose?: boolean; // default: true - inherited from global tabEnableClose
    enableDrag?: boolean; // default: true - inherited from global tabEnableDrag
    enableFloat?: boolean; // default: false - inherited from global tabEnableFloat
    enableRename?: boolean; // default: true - inherited from global tabEnableRename
    enableRenderOnDemand?: boolean; // default: true - inherited from global tabEnableRenderOnDemand
    floating?: boolean; // default: false
    helpText?: string;
    icon?: string; //  - inherited from global tabIcon
    id?: string;
    name?: string; // default: "[Unnamed Tab]"
    type?: string; // default: "tab"
}
export interface IBorderAttributes {
    autoSelectTabWhenClosed?: boolean; // default: false - inherited from global borderAutoSelectTabWhenClosed
    autoSelectTabWhenOpen?: boolean; // default: true - inherited from global borderAutoSelectTabWhenOpen
    barSize?: number; // default: 0 - inherited from global borderBarSize
    className?: string; //  - inherited from global borderClassName
    config?: any;
    enableAutoHide?: boolean; // default: false - inherited from global borderEnableAutoHide
    enableDrop?: boolean; // default: true - inherited from global borderEnableDrop
    minSize?: number; // default: 0 - inherited from global borderMinSize
    selected?: number; // default: -1
    show?: boolean; // default: true
    size?: number; // default: 200 - inherited from global borderSize
    type: "border";
}
