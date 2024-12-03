import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from "react";
import { CLASSES } from "../src/Types";
import { App, twoTabs, threeTabs, withBorders } from "./App";
import { AppEx, layoutEx2, layoutEx1 } from "./AppEx";

enum Location {
    TOP, BOTTOM, LEFT, RIGHT, CENTER,
    LEFTEDGE
}

// Helper to find elements by data-layout-path
const findByPath = (container: HTMLElement, path: string) => {
    return container.querySelector(`[data-layout-path="${path}"]`);
};

// Helper to find tab buttons
const findTabButton = (container: HTMLElement, path: string, index: number) => {
    return findByPath(container, `${path}/tb${index}`);
};

// Helper to check tab state
const checkTab = (container: HTMLElement, path: string, index: number, selected: boolean, text: string) => {
    const button = findTabButton(container, path, index);
    expect(button).toBeTruthy();
    expect(button?.classList.contains(selected ? "flexlayout__tab_button--selected" : "flexlayout__tab_button--unselected")).toBeTruthy();
    expect(button?.querySelector(".flexlayout__tab_button_content")?.textContent).toContain(text);
    
    const tab = findByPath(container, `${path}/t${index}`);
    expect(tab).toBeTruthy();
    expect(tab?.textContent).toContain(text);
};

// Helper to simulate drag and drop
const simulateDragAndDrop = async (container: HTMLElement, fromEl: Element, toEl: Element, location: Location) => {
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    
    const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2
    };
    
    const toPoint = {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2
    };

    // Simulate drag sequence
    fireEvent.mouseDown(fromEl);
    fireEvent.mouseMove(document, { clientX: fromCenter.x + 10, clientY: fromCenter.y + 10 });
    fireEvent.mouseMove(document, { clientX: toPoint.x, clientY: toPoint.y });
    fireEvent.mouseUp(toEl);
};
/*

    Key elements have data-layout-path attributes:

    /ts0 - the first tabset in the root row
    /ts1 - the second tabset in the root row
    /ts1/tabstrip - the second tabsets tabstrip
    /ts1/header - the second tabsets header
    /c2/ts0 - the first tabset in the column at position 2 in the root row
    /s0 - the first splitter in the root row (the one after the first tabset/column)
    /ts1/t2 - the third tab (the tab content) in the second tabset in the root row
    /ts1/tb2 - the third tab button (the tab button in the tabstrip) in the second tabset in the root row
    /border/top/t1
    /border/top/tb1
    ...

    Note: use it.only(... to run a single test

*/

describe("Drag tests", () => {
    describe("two tabs", () => {
        let container: HTMLElement;
        
        beforeEach(() => {
            const { container: c } = render(<App json={twoTabs} />);
            container = c;
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
        });

        it("tab to tab center", async () => {
            const fromEl = findTabButton(container, "/ts0", 0);
            const toEl = findByPath(container, "/ts1/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();
            
            await simulateDragAndDrop(container, fromEl!, toEl!, Location.CENTER);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(1);
            checkTab(container, "/ts0", 0, false, "Two"); 
            checkTab(container, "/ts0", 1, true, "One");
        });

        it("tab to tab top", async () => {
            const fromEl = findTabButton(container, "/ts0", 0);
            const toEl = findByPath(container, "/ts1/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();
            
            await simulateDragAndDrop(container, fromEl!, toEl!, Location.TOP);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/c0/ts0", 0, true, "One");
            checkTab(container, "/c0/ts1", 0, true, "Two");
        });

        it("tab to tab bottom", async () => {
            const fromEl = findTabButton(container, "/ts0", 0);
            const toEl = findByPath(container, "/ts1/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();
            
            await simulateDragAndDrop(container, fromEl!, toEl!, Location.BOTTOM);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/c0/ts0", 0, true, "Two");
            checkTab(container, "/c0/ts1", 0, true, "One");
        });

        it("tab to tab left", async () => {
            const fromEl = findTabButton(container, "/ts0", 0);
            const toEl = findByPath(container, "/ts1/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();
            
            await simulateDragAndDrop(container, fromEl!, toEl!, Location.LEFT);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/ts0", 0, true, "One");
            checkTab(container, "/ts1", 0, true, "Two");
        });

        it("tab to tab right", async () => {
            const fromEl = findTabButton(container, "/ts0", 0);
            const toEl = findByPath(container, "/ts1/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();
            
            await simulateDragAndDrop(container, fromEl!, toEl!, Location.RIGHT);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/ts0", 0, true, "Two");
            checkTab(container, "/ts1", 0, true, "One");
        });

        it("tab to edge", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            expect(fromTab).toBeTruthy();
            await simulateDragToEdge(container, fromTab!, 2);
            checkTab(container, "/c0/ts0", 0, true, "Two");
            checkTab(container, "/c0/ts1", 0, true, "One");
        })
    });

    describe("three tabs", () => {
        beforeEach(() => {
            const { container: c } = render(<App json={threeTabs} />);
            container = c;
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
        });

        it("tab to tabset", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTabstrip = findByPath(container, "/ts1/tabstrip");
            expect(fromTab).toBeTruthy();
            expect(toTabstrip).toBeTruthy();
            
            await simulateDrag(container, fromTab!, toTabstrip!, Location.CENTER);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/ts0", 0, false, "Two");
            checkTab(container, "/ts0", 1, true, "One"); 
            checkTab(container, "/ts1", 0, true, "Three");
        });

        it("tab to tab center", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findByPath(container, "/ts1/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.CENTER);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkTab(container, "/ts0", 0, false, "Two");
            checkTab(container, "/ts0", 1, true, "One");
            checkTab(container, "/ts1", 0, true, "Three");
        });

        it("tab to tab top", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findByPath(container, "/ts1/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.TOP);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/c0/ts0", 0, true, "One");
            checkTab(container, "/c0/ts1", 0, true, "Two");
            checkTab(container, "/ts1", 0, true, "Three");
        });

        it("tab to tab bottom", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findByPath(container, "/ts1/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.BOTTOM);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/c0/ts0", 0, true, "Two");
            checkTab(container, "/c0/ts1", 0, true, "One");
            checkTab(container, "/ts1", 0, true, "Three");
        });

        it("tab to tab left", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findByPath(container, "/ts1/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.LEFT);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/ts0", 0, true, "One");
            checkTab(container, "/ts1", 0, true, "Two");
            checkTab(container, "/ts2", 0, true, "Three");
        });

        it("tab to tab right", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findByPath(container, "/ts1/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.RIGHT);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/ts0", 0, true, "Two");
            checkTab(container, "/ts1", 0, true, "One"); 
            checkTab(container, "/ts2", 0, true, "Three");
        });

        it("tab to edge top", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            expect(fromTab).toBeTruthy();
            
            await simulateDragToEdge(container, fromTab!, 0);
            
            checkTab(container, "/c0/ts0", 0, true, "One");
            checkTab(container, "/c0/r1/ts0", 0, true, "Two");
            checkTab(container, "/c0/r1/ts1", 0, true, "Three");
        });

        it("tab to edge left", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            expect(fromTab).toBeTruthy();
            
            await simulateDragToEdge(container, fromTab!, 1);
            
            checkTab(container, "/ts0", 0, true, "One");
            checkTab(container, "/ts1", 0, true, "Two"); 
            checkTab(container, "/ts2", 0, true, "Three");
        });

        it("tab to edge bottom", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            expect(fromTab).toBeTruthy();
            
            await simulateDragToEdge(container, fromTab!, 2);
            
            checkTab(container, "/c0/r0/ts0", 0, true, "Two");
            checkTab(container, "/c0/r0/ts1", 0, true, "Three");
            checkTab(container, "/c0/ts1", 0, true, "One");
        });

        it("tab to edge right", async () => {
            const fromTab = findTabButton(container, "/ts0", 0);
            expect(fromTab).toBeTruthy();
            
            await simulateDragToEdge(container, fromTab!, 3);
            
            checkTab(container, "/ts0", 0, true, "Two");
            checkTab(container, "/ts1", 0, true, "Three");
            checkTab(container, "/ts2", 0, true, "One");
        });

        it("row to column", async () => {
            const fromEl1 = findTabButton(container, "/ts0", 0);
            const toEl1 = findByPath(container, "/ts2/t0");
            expect(fromEl1).toBeTruthy();
            expect(toEl1).toBeTruthy();

            await simulateDrag(container, fromEl1!, toEl1!, Location.BOTTOM);

            const fromEl2 = findTabButton(container, "/ts0", 0);
            const toEl2 = findByPath(container, "/c1/ts0/t0");
            expect(fromEl2).toBeTruthy();
            expect(toEl2).toBeTruthy();

            await simulateDrag(container, fromEl2!, toEl2!, Location.BOTTOM);

            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/c0/ts0", 0, true, "Three");
            checkTab(container, "/c0/ts1", 0, true, "Two"); 
            checkTab(container, "/c0/ts2", 0, true, "One");
        });

        it("row to single tabset", async () => {
            const fromTab1 = findTabButton(container, "/ts0", 0);
            const toTab1 = findByPath(container, "/ts2/t0");
            expect(fromTab1).toBeTruthy();
            expect(toTab1).toBeTruthy();

            await simulateDrag(container, fromTab1!, toTab1!, Location.CENTER);

            const fromTab2 = findTabButton(container, "/ts0", 0);
            const toTab2 = findByPath(container, "/ts1/t1");
            expect(fromTab2).toBeTruthy();
            expect(toTab2).toBeTruthy();

            await simulateDrag(container, fromTab2!, toTab2!, Location.CENTER);

            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(1);
            checkTab(container, "/ts0", 0, false, "Three");
            checkTab(container, "/ts0", 1, false, "One");
            checkTab(container, "/ts0", 2, true, "Two");
        });

        it("move tab in tabstrip", async () => {
            const fromTab1 = findTabButton(container, "/ts0", 0);
            const toTab1 = findByPath(container, "/ts2/t0");
            expect(fromTab1).toBeTruthy();
            expect(toTab1).toBeTruthy();

            await simulateDrag(container, fromTab1!, toTab1!, Location.CENTER);

            const fromTab2 = findTabButton(container, "/ts0", 0);
            const toTab2 = findByPath(container, "/ts1/t1");
            expect(fromTab2).toBeTruthy();
            expect(toTab2).toBeTruthy();

            await simulateDrag(container, fromTab2!, toTab2!, Location.CENTER);
            checkTab(container, "/ts0", 0, false, "Three");
            checkTab(container, "/ts0", 1, false, "One");
            checkTab(container, "/ts0", 2, true, "Two");

            const fromTab3 = findTabButton(container, "/ts0", 2);
            const toTab3 = findTabButton(container, "/ts0", 0);
            expect(fromTab3).toBeTruthy();
            expect(toTab3).toBeTruthy();

            await simulateDrag(container, fromTab3!, toTab3!, Location.LEFT);
            checkTab(container, "/ts0", 0, true, "Two");
            checkTab(container, "/ts0", 1, false, "Three");
            checkTab(container, "/ts0", 2, false, "One");
        });

        it("move tabstrip", async () => {
            const fromEl1 = findByPath(container, "/ts2/tabstrip");
            const toEl1 = findByPath(container, "/ts0/t0");
            expect(fromEl1).toBeTruthy();
            expect(toEl1).toBeTruthy();

            await simulateDrag(container, fromEl1!, toEl1!, Location.CENTER);

            checkTab(container, "/ts0", 0, true, "One");
            checkTab(container, "/ts0", 1, false, "Three");
            checkTab(container, "/ts1", 0, true, "Two");

            const fromEl2 = findByPath(container, "/ts0/tabstrip");
            const toEl2 = findByPath(container, "/ts1/tabstrip");
            expect(fromEl2).toBeTruthy();
            expect(toEl2).toBeTruthy();

            await simulateDrag(container, fromEl2!, toEl2!, Location.CENTER);

            checkTab(container, "/ts0", 0, true, "Two");
            checkTab(container, "/ts0", 1, false, "One");
            checkTab(container, "/ts0", 2, false, "Three");
        });

        it("move using header", async () => {
            const fromEl = findByPath(container, "/ts1/header");
            const toEl = findByPath(container, "/ts0/t0");
            expect(fromEl).toBeTruthy();
            expect(toEl).toBeTruthy();

            await simulateDrag(container, fromEl!, toEl!, Location.TOP);

            checkTab(container, "/c0/ts0", 0, true, "Two");
            checkTab(container, "/c0/ts1", 0, true, "One");
            checkTab(container, "/ts1", 0, true, "Three");
        });
    })

    describe("borders", () => {
        beforeEach(() => {
            mount(<App json={withBorders} />);
            findAllTabSets().should("have.length", 3);
        });

        const borderToTabTest = async (container: HTMLElement, border: string, tabtext: string, index: number) => {
            const fromTab = findTabButton(container, border, 0);
            const toTab = findByPath(container, "/ts0/t0");
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.CENTER);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(3);
            checkTab(container, "/ts0", 0, false, "One");
            checkTab(container, "/ts0", index, true, tabtext);
        };

        it("border top to tab", async () => {
            await borderToTabTest(container, "/border/top", "top1", 1);
        });

        it("border bottom to tab", async () => {
            await borderToTabTest(container, "/border/bottom", "bottom1", 1);
        });

        it("border left to tab", async () => {
            await borderToTabTest(container, "/border/left", "left1", 1);
        });

        it("border right to tab", async () => {
            await borderToTabTest(container, "/border/right", "right1", 1);
        });

        const tabToBorderTest = async (container: HTMLElement, border: string, tabtext: string, index: number) => {
            const fromTab = findTabButton(container, "/ts0", 0);
            const toTab = findTabButton(container, border, 0);
            expect(fromTab).toBeTruthy();
            expect(toTab).toBeTruthy();

            await simulateDrag(container, fromTab!, toTab!, Location.CENTER);
            
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
            checkBorderTab(container, border, 0, false, tabtext);
            checkBorderTab(container, border, index, false, "One");
        };

        it("tab to border top", async () => {
            await tabToBorderTest(container, "/border/top", "top1", 1);
        });

        it("tab to border bottom", async () => {
            await tabToBorderTest(container, "/border/bottom", "bottom1", 1);
        });

        it("tab to border left", async () => {
            await tabToBorderTest(container, "/border/left", "left1", 1);
        });

        it("tab to border right", async () => {
            await tabToBorderTest(container, "/border/right", "right1", 1);
        });

        const openTabTest = (border, tabtext, index) => {
            findTabButton(border, 0).as("to").click();
            findTabButton("/ts0", 0).as("from");
            findPath(border).as("to");

            drag("@from", "@to", Location.CENTER);
            findAllTabSets().should("have.length", 2);
            checkBorderTab(border, 0, false, tabtext);
            checkBorderTab(border, index, true, "One");
        };

        it("tab to open border top", () => {
            openTabTest("/border/top", "top1", 1);
        })

        it("tab to open border bottom", () => {
            openTabTest("/border/bottom", "bottom1", 2);
        })

        it("tab to open border left", () => {
            openTabTest("/border/left", "left1", 1);
        })

        it("tab to open border right", () => {
            openTabTest("/border/right", "right1", 1);
        })

        const openTabCenterTest = (border, tabtext, index) => {
            findTabButton(border, 0).click();
            findTabButton("/ts0", 0).as("from");
            findPath(border + "/t0").as("to");

            drag("@from", "@to", Location.CENTER);
            findAllTabSets().should("have.length", 2);
            checkBorderTab(border, 0, false, tabtext);
            checkBorderTab(border, index, true, "One");
        };

        it("tab to open border top center", () => {
            openTabCenterTest("/border/top", "top1", 1);
        })

        it("tab to open border bottom center", () => {
            openTabCenterTest("/border/bottom", "bottom1", 2);
        })

        it("tab to open border left center", () => {
            openTabCenterTest("/border/left", "left1", 1);
        })

        it("tab to open border right center", () => {
            openTabCenterTest("/border/right", "right1", 1);
        })

        const inBorderTabMoveTest = (border, tabtext, index) => {
            findTabButton("/ts0", 0).as("from");
            findPath(border).as("to");
            drag("@from", "@to", Location.CENTER);
            findAllTabSets().should("have.length", 2);
            checkBorderTab(border, 0, false, tabtext);
            checkBorderTab(border, index, false, "One");

            findTabButton(border, 0).as("from");
            findTabButton(border, index).as("to");
            drag("@from", "@to", Location.RIGHT);
            checkBorderTab(border, index, false, tabtext);
        };

        it("move tab in border top", () => {
            inBorderTabMoveTest("/border/top", "top1", 1);
        })

        it("move tab in border bottom", () => {
            inBorderTabMoveTest("/border/bottom", "bottom1", 2);
        })

        it("move tab in border left", () => {
            inBorderTabMoveTest("/border/left", "left1", 1);
        })

        it("move tab in border right", () => {
            inBorderTabMoveTest("/border/right", "right1", 1);
        })
    })

    describe("Splitters", () => {
        let container: HTMLElement;
        
        beforeEach(() => {
            const { container: c } = render(<App json={twoTabs} />);
            container = c;
            const tabsets = container.querySelectorAll('.flexlayout__tabset');
            expect(tabsets.length).toBe(2);
        });

        it("vsplitter", async () => {
            const splitter = findByPath(container, "/s0");
            expect(splitter).toBeTruthy();
            
            // Simulate splitter drag
            const rect = splitter!.getBoundingClientRect();
            fireEvent.mouseDown(splitter!);
            fireEvent.mouseMove(document, { clientX: rect.x + 100, clientY: rect.y });
            fireEvent.mouseUp(document);
            
            const ts1 = findByPath(container, "/ts1");
            const ts0 = findByPath(container, "/ts0");
            expect(ts0!.getBoundingClientRect().width - ts1!.getBoundingClientRect().width).toBeGreaterThan(99);
        });

        it("vsplitter to edge", async () => {
            const splitter = findByPath(container, "/s0");
            expect(splitter).toBeTruthy();
            
            // Drag to right edge
            let rect = splitter!.getBoundingClientRect();
            fireEvent.mouseDown(splitter!);
            fireEvent.mouseMove(document, { clientX: rect.x + 1000, clientY: rect.y });
            fireEvent.mouseUp(document);
            
            // Drag back 100px
            rect = splitter!.getBoundingClientRect();
            fireEvent.mouseDown(splitter!);
            fireEvent.mouseMove(document, { clientX: rect.x - 100, clientY: rect.y });
            fireEvent.mouseUp(document);
            
            const ts1 = findByPath(container, "/ts1");
            expect(Math.abs(ts1!.getBoundingClientRect().width - 100)).toBeLessThan(2);
        });

        describe("horizontal", () => {
            beforeEach(async () => {
                const fromTab = findTabButton(container, "/ts0", 0);
                const toTab = findByPath(container, "/ts1/t0");
                expect(fromTab).toBeTruthy();
                expect(toTab).toBeTruthy();
                
                await simulateDragAndDrop(container, fromTab!, toTab!, Location.BOTTOM);
                
                const tabsets = container.querySelectorAll('.flexlayout__tabset');
                expect(tabsets.length).toBe(2);
                checkTab(container, "/c0/ts0", 0, true, "Two");
                checkTab(container, "/c0/ts1", 0, true, "One");
            });

            it("hsplitter", async () => {
                const splitter = findByPath(container, "/c0/s0");
                expect(splitter).toBeTruthy();
                
                const rect = splitter!.getBoundingClientRect();
                fireEvent.mouseDown(splitter!);
                fireEvent.mouseMove(document, { clientX: rect.x, clientY: rect.y + 100 });
                fireEvent.mouseUp(document);
                
                const ts1 = findByPath(container, "/c0/ts1");
                const ts0 = findByPath(container, "/c0/ts0");
                expect(ts0!.getBoundingClientRect().height - ts1!.getBoundingClientRect().height).toBeGreaterThan(99);
            });

            it("hsplitter to edge", async () => {
                const splitter = findByPath(container, "/c0/s0");
                expect(splitter).toBeTruthy();
                
                // Drag to bottom edge
                let rect = splitter!.getBoundingClientRect();
                fireEvent.mouseDown(splitter!);
                fireEvent.mouseMove(document, { clientX: rect.x, clientY: rect.y + 1000 });
                fireEvent.mouseUp(document);
                
                // Drag back 100px
                rect = splitter!.getBoundingClientRect();
                fireEvent.mouseDown(splitter!);
                fireEvent.mouseMove(document, { clientX: rect.x, clientY: rect.y - 100 });
                fireEvent.mouseUp(document);
                
                const ts1 = findByPath(container, "/c0/ts1");
                expect(Math.abs(ts1!.getBoundingClientRect().height - 100)).toBeLessThan(2);
            });
        });
    });
})

describe("Overflow menu", () => {
    let container: HTMLElement;
    
    beforeEach(async () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tabstrip = findByPath(container, "/ts0/tabstrip");
        fireEvent.click(tabstrip!);
        
        const addButton = container.querySelector('[data-id="add-active"]');
        fireEvent.click(addButton!);
        fireEvent.click(addButton!);
    });

    it("show menu", async () => {
        let overflowButton = findByPath(container, "/ts0/button/overflow");
        expect(overflowButton).toBeFalsy();

        // Simulate splitter drag to create overflow
        const splitter = findByPath(container, "/s0");
        let rect = splitter!.getBoundingClientRect();
        
        // Drag to left edge
        fireEvent.mouseDown(splitter!);
        fireEvent.mouseMove(document, { clientX: rect.x - 1000, clientY: rect.y });
        fireEvent.mouseUp(document);
        
        // Drag back 150px
        rect = splitter!.getBoundingClientRect();
        fireEvent.mouseDown(splitter!);
        fireEvent.mouseMove(document, { clientX: rect.x + 150, clientY: rect.y });
        fireEvent.mouseUp(document);

        // Check tabs visibility
        const tab2 = findByPath(container, "/ts0/t2");
        const tab0 = findByPath(container, "/ts0/t0");
        expect(tab2).toBeVisible();
        expect(tab0).not.toBeVisible();

        // Check overflow menu
        overflowButton = findByPath(container, "/ts0/button/overflow");
        expect(overflowButton).toBeTruthy();
        fireEvent.click(overflowButton!);

        const popupMenu = findByPath(container, "/popup-menu");
        expect(popupMenu).toBeTruthy();

        // Click first item in overflow menu
        const menuItem = findByPath(container, "/popup-menu/tb0");
        fireEvent.click(menuItem!);

        // Check updated visibility
        expect(tab2).not.toBeVisible();
        expect(tab0).toBeVisible();

        // Expand tabset
        rect = splitter!.getBoundingClientRect();
        fireEvent.mouseDown(splitter!);
        fireEvent.mouseMove(document, { clientX: rect.x + 300, clientY: rect.y });
        fireEvent.mouseUp(document);

        // Overflow button should disappear
        overflowButton = findByPath(container, "/ts0/button/overflow");
        expect(overflowButton).toBeFalsy();
    });
});

describe("Add methods", () => {
    let container: HTMLElement;
    
    beforeEach(() => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
    });

    it("drag to tabset", async () => {
        const fromEl = container.querySelector('[data-id="add-drag"]');
        const toEl = findByPath(container, "/ts1/tabstrip");
        expect(fromEl).toBeTruthy();
        expect(toEl).toBeTruthy();
        
        await simulateDragAndDrop(container, fromEl!, toEl!, Location.CENTER);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkTab(container, "/ts1", 0, false, "Two");
        checkTab(container, "/ts1", 1, true, "Text0");
    });

    it("drag to border", async () => {
        const fromEl = container.querySelector('[data-id="add-drag"]');
        const toEl = findByPath(container, "/border/right");
        expect(fromEl).toBeTruthy();
        expect(toEl).toBeTruthy();
        
        await simulateDragAndDrop(container, fromEl!, toEl!, Location.CENTER);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkBorderTab(container, "/border/right", 0, false, "right1");
        checkBorderTab(container, "/border/right", 1, false, "Text0");
    });

    it("drag indirect to tabset", async () => {
        const addButton = container.querySelector('[data-id="add-indirect"]');
        fireEvent.click(addButton!);
        
        const fromEl = findByPath(container, "/drag-rectangle");
        const toEl = findByPath(container, "/ts1/tabstrip");
        expect(fromEl).toBeTruthy();
        expect(toEl).toBeTruthy();
        
        await simulateDragAndDrop(container, fromEl!, toEl!, Location.CENTER);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkTab(container, "/ts1", 0, false, "Two");
        checkTab(container, "/ts1", 1, true, "Text0");
    });

    it("drag indirect to border", async () => {
        const addButton = container.querySelector('[data-id="add-indirect"]');
        fireEvent.click(addButton!);
        
        const fromEl = findByPath(container, "/drag-rectangle");
        const toEl = findByPath(container, "/border/right");
        expect(fromEl).toBeTruthy();
        expect(toEl).toBeTruthy();
        
        await simulateDragAndDrop(container, fromEl!, toEl!, Location.CENTER);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkBorderTab(container, "/border/right", 0, false, "right1");
        checkBorderTab(container, "/border/right", 1, false, "Text0");
    });

    it("add to tabset with id #1", () => {
        const addButton = container.querySelector('[data-id="add-byId"]');
        fireEvent.click(addButton!);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkTab(container, "/ts1", 0, false, "Two");
        checkTab(container, "/ts1", 1, true, "Text0");
    });

    it("add to active tabset", () => {
        const tabstrip = findByPath(container, "/ts1/tabstrip");
        fireEvent.click(tabstrip!);
        
        const addButton = container.querySelector('[data-id="add-active"]');
        fireEvent.click(addButton!);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
        checkTab(container, "/ts1", 0, false, "Two");
        checkTab(container, "/ts1", 1, true, "Text0");
    });
});

describe("Delete methods", () => {
    let container: HTMLElement;
    
    beforeEach(() => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
    });

    it("delete tab", () => {
        const closeButton = findByPath(container, "/ts1/tb0/button/close");
        fireEvent.click(closeButton!);
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(2);
        checkTab(container, "/ts0", 0, true, "One");
        checkTab(container, "/ts1", 0, true, "Three");
    });

    it("delete all tabs", () => {
        const closeButtons = [
            findByPath(container, "/ts1/tb0/button/close"),
            findByPath(container, "/ts1/tb0/button/close"),
            findByPath(container, "/ts0/tb0/button/close")
        ];
        
        closeButtons.forEach(button => {
            fireEvent.click(button!);
        });
        
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(1);
        expect(findByPath(container, "/ts1/tb0")).toBeFalsy();
    });

    it("delete tab in border", () => {
        checkBorderTab(container, "/border/bottom", 0, false, "bottom1");
        
        const closeButton = findByPath(container, "/border/bottom/tb0/button/close");
        fireEvent.click(closeButton!);
        
        checkBorderTab(container, "/border/bottom", 0, false, "bottom2");
    });
});

describe("Maximize methods", () => {
    let container: HTMLElement;
    
    beforeEach(() => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        const tabsets = container.querySelectorAll('.flexlayout__tabset');
        expect(tabsets.length).toBe(3);
    });

    it("maximize tabset using max button", () => {
        const maxButton = findByPath(container, "/ts1/button/max");
        fireEvent.click(maxButton!);
        
        expect(findByPath(container, "/ts0")).not.toBeVisible();
        expect(findByPath(container, "/ts1")).toBeVisible();
        expect(findByPath(container, "/ts2")).not.toBeVisible();

        fireEvent.click(maxButton!);
        
        expect(findByPath(container, "/ts0")).toBeVisible();
        expect(findByPath(container, "/ts1")).toBeVisible();
        expect(findByPath(container, "/ts2")).toBeVisible();
    });

    it("maximize tabset using double click", () => {
        const tabstrip = findByPath(container, "/ts1/tabstrip");
        fireEvent.doubleClick(tabstrip!);
        
        expect(findByPath(container, "/ts0")).not.toBeVisible();
        expect(findByPath(container, "/ts1")).toBeVisible();
        expect(findByPath(container, "/ts2")).not.toBeVisible();

        const maxButton = findByPath(container, "/ts1/button/max");
        fireEvent.click(maxButton!);
        
        expect(findByPath(container, "/ts0")).toBeVisible();
        expect(findByPath(container, "/ts1")).toBeVisible();
        expect(findByPath(container, "/ts2")).toBeVisible();
    });
});

describe("Others", () => {
    let container: HTMLElement;

    it("rename tab", () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tabButton = findByPath(container, "/ts1/tb0");
        fireEvent.doubleClick(tabButton!);
        
        const textbox = findByPath(container, "/ts1/tb0/textbox");
        expect(textbox).toBeTruthy();
        expect(textbox).toHaveValue("Two");
        
        fireEvent.change(textbox!, { target: { value: "Renamed" } });
        fireEvent.keyDown(textbox!, { key: 'Enter' });
        
        checkTab(container, "/ts1", 0, true, "Renamed");
    });

    it("rename tab cancelled with esc", () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tabButton = findByPath(container, "/ts1/tb0");
        fireEvent.doubleClick(tabButton!);
        
        const textbox = findByPath(container, "/ts1/tb0/textbox");
        expect(textbox).toBeTruthy();
        
        fireEvent.change(textbox!, { target: { value: "Renamed" } });
        fireEvent.keyDown(textbox!, { key: 'Escape' });
        
        checkTab(container, "/ts1", 0, true, "Two");
    });

    it("click on tab contents causes tabset activate", () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tab1 = findByPath(container, "/ts1/t0");
        fireEvent.click(tab1!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tab0 = findByPath(container, "/ts0/t0");
        fireEvent.click(tab0!);
        
        expect(findByPath(container, "/ts0/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tab2 = findByPath(container, "/ts2/t0");
        fireEvent.click(tab2!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
    });

    it("click on tab button causes tabset activate", () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tabButton1 = findByPath(container, "/ts1/tb0");
        fireEvent.click(tabButton1!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tabButton0 = findByPath(container, "/ts0/tb0");
        fireEvent.click(tabButton0!);
        
        expect(findByPath(container, "/ts0/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tabButton2 = findByPath(container, "/ts2/tb0");
        fireEvent.click(tabButton2!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
    });

    it("click on tabstrip causes tabset activate", () => {
        const { container: c } = render(<App json={withBorders} />);
        container = c;
        
        const tabstrip1 = findByPath(container, "/ts1/tabstrip");
        fireEvent.click(tabstrip1!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tabstrip0 = findByPath(container, "/ts0/tabstrip");
        fireEvent.click(tabstrip0!);
        
        expect(findByPath(container, "/ts0/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        
        const tabstrip2 = findByPath(container, "/ts2/tabstrip");
        fireEvent.click(tabstrip2!);
        
        expect(findByPath(container, "/ts0/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts1/tabstrip")).not.toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
        expect(findByPath(container, "/ts2/tabstrip")).toHaveClass(CLASSES.FLEXLAYOUT__TABSET_SELECTED);
    });

    it("tab can have icon", () => {
        const { container } = render(<App json={threeTabs} />);
        
        const tabButton = findByPath(container, "/ts1/tb0");
        const img = tabButton!.querySelector(`.${CLASSES.FLEXLAYOUT__TAB_BUTTON_LEADING} img`);
        
        expect(img).toHaveAttribute("src", "/test/images/settings.svg");
    });
});

describe("Extended App", () => {
    let container: HTMLElement;
    
    beforeEach(() => {
        const { container: c } = render(<AppEx json={layoutEx1} />);
        container = c;
    });

    it("onRenderTab", () => {
        const tabButton = findByPath(container, "/ts1/tb0");
        const leadingImg = tabButton?.querySelector(`.${CLASSES.FLEXLAYOUT__TAB_BUTTON_LEADING} img`);
        const trailingImg = tabButton?.querySelectorAll('img')[1];
        
        expect(leadingImg).toHaveAttribute("src", "/test/images/settings.svg");
        expect(trailingImg).toHaveAttribute("src", "/test/images/folder.svg");
    });

    it("onRenderTab in border", () => {
        const borderButton = findByPath(container, "/border/top/tb0");
        const leadingImg = borderButton?.querySelector(`.${CLASSES.FLEXLAYOUT__BORDER_BUTTON_LEADING} img`);
        const tabButton = findByPath(container, "/ts1/tb0");
        const trailingImg = tabButton?.querySelectorAll('img')[1];
        
        expect(leadingImg).toHaveAttribute("src", "/test/images/settings.svg");
        expect(trailingImg).toHaveAttribute("src", "/test/images/folder.svg");
    });

    it("onRenderTabSet", () => {
        const tabstrip = findByPath(container, "/ts1/tabstrip");
        const images = tabstrip?.querySelectorAll(`.${CLASSES.FLEXLAYOUT__TAB_TOOLBAR} img`);
        
        expect(images?.[0]).toHaveAttribute("src", "/test/images/folder.svg");
        expect(images?.[1]).toHaveAttribute("src", "/test/images/settings.svg");
    });

    it("onRenderTabSet sticky buttons", () => {
        const tabstrip = findByPath(container, "/ts2/tabstrip");
        const img = tabstrip?.querySelector(`.${CLASSES.FLEXLAYOUT__TAB_TOOLBAR_STICKY_BUTTONS_CONTAINER} img`);
        
        expect(img).toHaveAttribute("src", "/test/images/add.svg");
    });

    it("onRenderTabSet for header", () => {
        const header = findByPath(container, "/ts1/header");
        const images = header?.querySelectorAll(`.${CLASSES.FLEXLAYOUT__TAB_TOOLBAR} img`);
        
        expect(images?.[0]).toHaveAttribute("src", "/test/images/settings.svg");
        expect(images?.[1]).toHaveAttribute("src", "/test/images/folder.svg");
    });

    it("onRenderTabSet for border", () => {
        const border = findByPath(container, "/border/top");
        const images = border?.querySelectorAll(`.${CLASSES.FLEXLAYOUT__BORDER_TOOLBAR} img`);
        
        expect(images?.[0]).toHaveAttribute("src", "/test/images/folder.svg");
        expect(images?.[1]).toHaveAttribute("src", "/test/images/settings.svg");
    });
});

describe("Extended layout2", () => {
    let container: HTMLElement;
    
    beforeEach(() => {
        const { container: c } = render(<AppEx json={layoutEx2} />);
        container = c;
    });

    it("check tabset min size", async () => {
        const splitter = findByPath(container, "/s0");
        await simulateDragAndDrop(container, splitter!, splitter!, { x: -1000, y: 0 });
        const ts0 = findByPath(container, "/ts0");
        expect(Math.abs(ts0!.getBoundingClientRect().width - 100)).toBeLessThan(2);

        const splitter1 = findByPath(container, "/s1");
        await simulateDragAndDrop(container, splitter1!, splitter1!, { x: 1000, y: 0 });
        const ts1 = findByPath(container, "/c2/ts0");
        expect(Math.abs(ts1!.getBoundingClientRect().width - 100)).toBeLessThan(2);

        const splitter2 = findByPath(container, "/c2/s0");
        await simulateDragAndDrop(container, splitter2!, splitter2!, { x: 0, y: -1000 });
        const ts2 = findByPath(container, "/c2/ts0");
        expect(Math.abs(ts2!.getBoundingClientRect().height - 100)).toBeLessThan(2);

        await simulateDragAndDrop(container, splitter2!, splitter2!, { x: 0, y: 1000 });
        const ts3 = findByPath(container, "/c2/ts1");
        expect(Math.abs(ts3!.getBoundingClientRect().height - 100)).toBeLessThan(2);
    });

    it("check border min sizes", async () => {
        // Top border
        const topTab = findByPath(container, "/border/top/tb0");
        fireEvent.click(topTab!);
        const topSplitter = findByPath(container, "/border/top/s");
        await simulateDragAndDrop(container, topSplitter!, topSplitter!, { x: 0, y: -1000 });
        const topBorder = findByPath(container, "/border/top/t0");
        expect(Math.abs(topBorder!.getBoundingClientRect().height - 100)).toBeLessThan(2);

        // Bottom border
        const bottomTab = findByPath(container, "/border/bottom/tb0");
        fireEvent.click(bottomTab!);
        const bottomSplitter = findByPath(container, "/border/bottom/s");
        await simulateDragAndDrop(container, bottomSplitter!, bottomSplitter!, { x: 0, y: 1000 });
        const bottomBorder = findByPath(container, "/border/bottom/t0");
        expect(Math.abs(bottomBorder!.getBoundingClientRect().height - 100)).toBeLessThan(2);

        // Left border
        const leftTab = findByPath(container, "/border/left/tb0");
        fireEvent.click(leftTab!);
        const leftSplitter = findByPath(container, "/border/left/s");
        await simulateDragAndDrop(container, leftSplitter!, leftSplitter!, { x: -1000, y: 0 });
        const leftBorder = findByPath(container, "/border/left/t0");
        expect(Math.abs(leftBorder!.getBoundingClientRect().width - 100)).toBeLessThan(2);

        // Right border
        const rightTab = findByPath(container, "/border/right/tb0");
        fireEvent.click(rightTab!);
        const rightSplitter = findByPath(container, "/border/right/s");
        await simulateDragAndDrop(container, rightSplitter!, rightSplitter!, { x: 1000, y: 0 });
        const rightBorder = findByPath(container, "/border/right/t0");
        expect(Math.abs(rightBorder!.getBoundingClientRect().width - 100)).toBeLessThan(2);
    });

    it("tabset close", () => {
        expect(findByPath(container, "/ts0")).toBeTruthy();
        expect(findByPath(container, "/ts1")).toBeTruthy();
        expect(findByPath(container, "/ts2")).toBeFalsy();

        const closeButton = findByPath(container, "/c2/ts0/button/close");
        fireEvent.click(closeButton!);

        expect(findByPath(container, "/c2/ts0")).toBeFalsy();
        expect(findByPath(container, "/ts0")).toBeTruthy();
        expect(findByPath(container, "/ts1")).toBeTruthy();
        expect(findByPath(container, "/ts2")).toBeTruthy();
    });

    it("borders autohide", async () => {
        // Top border
        const topCloseButton = findByPath(container, "/border/top/tb0/button/close");
        fireEvent.click(topCloseButton!);
        expect(findByPath(container, "/border/top")).toBeFalsy();

        const fromTab = findTabButton(container, "/ts0", 0);
        const toTab = findTabButton(container, "/ts0", 0);
        await simulateDragAndDrop(container, fromTab!, toTab!, Location.TOP);
        expect(findByPath(container, "/border/top")).toBeTruthy();

        // Left border
        const leftCloseButton = findByPath(container, "/border/left/tb0/button/close");
        fireEvent.click(leftCloseButton!);
        expect(findByPath(container, "/border/left")).toBeFalsy();

        await simulateDragAndDrop(container, fromTab!, toTab!, Location.LEFTEDGE);
        expect(findByPath(container, "/border/left")).toBeTruthy();
    });
});


// ---------------------------- helpers ------------------------ 

// Helper to simulate drag operations
const simulateDrag = async (container: HTMLElement, fromEl: Element, toEl: Element, location: Location) => {
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    
    const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2
    };
    
    const toPoint = getLocation(toRect, location);

    // Simulate drag sequence
    fireEvent.mouseDown(fromEl, { clientX: fromCenter.x, clientY: fromCenter.y });
    fireEvent.mouseMove(document, { clientX: fromCenter.x + 10, clientY: fromCenter.y + 10 });
    fireEvent.mouseMove(document, { clientX: toPoint.x, clientY: toPoint.y });
    fireEvent.mouseUp(document, { clientX: toPoint.x, clientY: toPoint.y });
};

const simulateDragToEdge = async (container: HTMLElement, fromEl: Element, edgeIndex: number) => {
    const fromRect = fromEl.getBoundingClientRect();
    const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2
    };

    // Start drag to show edges
    fireEvent.mouseDown(fromEl);
    fireEvent.mouseMove(document, { clientX: fromCenter.x + 10, clientY: fromCenter.y + 10 });

    // Find edge target and wait for it to be visible
    await new Promise(resolve => setTimeout(resolve, 50)); // Wait for edge to appear
    const edge = container.querySelectorAll('.flexlayout__edge_rect')[edgeIndex];
    expect(edge).toBeTruthy();
    const edgeRect = edge.getBoundingClientRect();
    const toPoint = {
        x: edgeRect.left + edgeRect.width / 2,
        y: edgeRect.top + edgeRect.height / 2
    };

    // Complete drag to edge
    fireEvent.mouseMove(document, { clientX: toPoint.x, clientY: toPoint.y });
    fireEvent.mouseUp(document, { clientX: toPoint.x, clientY: toPoint.y });
};

const simulateSplitterDrag = async (container: HTMLElement, splitterEl: Element, upDown: boolean, distance: number) => {
    const rect = splitterEl.getBoundingClientRect();
    const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    
    const toPoint = {
        x: center.x + (upDown ? 0 : distance),
        y: center.y + (upDown ? distance : 0)
    };

    // Simulate complete drag sequence
    fireEvent.mouseDown(splitterEl);
    fireEvent.mouseMove(document, { clientX: center.x + 10, clientY: center.y + 10 });
    await new Promise(resolve => setTimeout(resolve, 50)); // Wait for drag to register
    fireEvent.mouseMove(document, { clientX: toPoint.x, clientY: toPoint.y });
    fireEvent.mouseUp(document, { clientX: toPoint.x, clientY: toPoint.y });
};

// Helper to get location point based on target rect and location enum
const getLocation = (rect: DOMRect, location: Location) => {
    switch (location) {
        case Location.TOP:
            return { x: rect.left + rect.width / 2, y: rect.top + 5 };
        case Location.BOTTOM:
            return { x: rect.left + rect.width / 2, y: rect.bottom - 5 };
        case Location.LEFT:
            return { x: rect.left + 5, y: rect.top + rect.height / 2 };
        case Location.RIGHT:
            return { x: rect.right - 5, y: rect.top + rect.height / 2 };
        case Location.CENTER:
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        case Location.LEFTEDGE:
            return { x: rect.left, y: rect.top + rect.height / 2 };
        default:
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
};

// Helper to check border tab state
const checkBorderTab = (container: HTMLElement, path: string, index: number, selected: boolean, text: string) => {
    const button = findByPath(container, `${path}/tb${index}`);
    expect(button).toBeTruthy();
    expect(button?.classList.contains(selected ? "flexlayout__border_button--selected" : "flexlayout__border_button--unselected")).toBeTruthy();
    expect(button?.querySelector(".flexlayout__border_button_content")?.textContent).toContain(text);
    
    const tab = findByPath(container, `${path}/t${index}`);
    expect(tab).toBeTruthy();
    expect(tab?.textContent).toContain(text);
};

// Helper functions are already defined at the top of the file
