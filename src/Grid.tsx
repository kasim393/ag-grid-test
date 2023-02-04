import {
  ColDef,
  GridApi,
  ICellRendererComp,
  ICellRendererParams,
  IsFullWidthRowParams,
  RowHeightParams,
  SuppressKeyboardEventParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { getData } from "./data";
import FullWidthCellRenderer from "./components/fullWidthCellRenderer";
import CustomFilter from "./components/CustomFilter";
import TestCell from "./components/TestCell";

function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return [true].indexOf(data.fullRow) > -1;
}
const GRID_CELL_CLASSNAME = "ag-full-width-row";
var savedSort: any;
const Grid = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const gridRef = useRef<AgGridReact>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      cellRenderer: TestCell,
      width: 10,
      editable: false,
      filter: false,
      cellStyle: { padding: "0px" },
    },
    {
      field: "name",
    },
    { field: "continent" },
    { field: "language" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      resizable: true,
      editable: true,
      filter: CustomFilter,
      autoHeight: true,
      wrapText: true,
      filterParams: {
        buttons: ["clear", "apply"],
      },
      suppressKeyboardEvent,
    };
  }, []);
  function getAllFocusableElementsOf(el: HTMLElement) {
    return Array.from<HTMLElement>(
      el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((focusableEl) => {
      return focusableEl.tabIndex !== -1;
    });
  }

  const getEventPath: (event: Event) => HTMLElement[] = (event: Event) => {
    const path: HTMLElement[] = [];
    let currentTarget: any = event.target;
    while (currentTarget) {
      path.push(currentTarget);
      currentTarget = currentTarget.parentElement;
    }
    return path;
  };
  /**
   * Capture whether the user is tabbing forwards or backwards and suppress keyboard event if tabbing
   * outside of the children
   */
  function suppressKeyboardEvent({ event }: SuppressKeyboardEventParams<any>) {
    const { key, shiftKey } = event;
    const path = getEventPath(event);
    const isTabForward = key === "Tab" && shiftKey === false;
    const isTabBackward = key === "Tab" && shiftKey === true;
    let suppressEvent = false;
    // Handle cell children tabbing
    if (isTabForward || isTabBackward) {
      const eGridCell = path.find((el) => {
        if (el.classList === undefined) return false;
        return el.classList.contains(GRID_CELL_CLASSNAME);
      });
      if (!eGridCell) {
        return suppressEvent;
      }
      const focusableChildrenElements = getAllFocusableElementsOf(eGridCell);
      const lastCellChildEl =
        focusableChildrenElements[focusableChildrenElements.length - 1];
      const firstCellChildEl = focusableChildrenElements[0];
      // Suppress keyboard event if tabbing forward within the cell and the current focused element is not the last child
      if (isTabForward && focusableChildrenElements.length > 0) {
        const isLastChildFocused =
          lastCellChildEl && document.activeElement === lastCellChildEl;
        if (!isLastChildFocused) {
          suppressEvent = true;
        }
      }
      // Suppress keyboard event if tabbing backwards within the cell, and the current focused element is not the first child
      else if (isTabBackward && focusableChildrenElements.length > 0) {
        const cellHasFocusedChildren =
          eGridCell.contains(document.activeElement) &&
          eGridCell !== document.activeElement;
        // Manually set focus to the last child element if cell doesn't have focused children
        if (!cellHasFocusedChildren) {
          lastCellChildEl.focus();
          // Cancel keyboard press, so that it doesn't focus on the last child and then pass through the keyboard press to
          // move to the 2nd last child element
          event.preventDefault();
        }
        const isFirstChildFocused =
          firstCellChildEl && document.activeElement === firstCellChildEl;
        if (!isFirstChildFocused) {
          suppressEvent = true;
        }
      }
    }
    return suppressEvent;
  }
  const getRowHeight = useCallback((params: RowHeightParams) => {
    if (isFullWidth(params.data)) {
      return 250;
    }
  }, []);
  const isFullWidthRow = useCallback((params: IsFullWidthRowParams) => {
    return isFullWidth(params.rowNode.data);
  }, []);
  const fullWidthCellRenderer = useMemo<any>(() => {
    return FullWidthCellRenderer;
  }, []);

  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className="ag-theme-alpine custom-grid ag-theme-graviti "
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowHeight={getRowHeight}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
          onGridReady={onGridReady}
          animateRows={true}
          rowBuffer={100}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default Grid;
