import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import textEditInput from "./EditTextInput";
import CustomLoadingCellRenderer from "./customLoadingCellRenderer";

export default (props: ICellRendererParams) => {
  const [rowData] = useState([
    { name: "Toyota", continent: "Celica", language: 35000 },
    { name: "Ford", continent: "Mondeo", language: 32000 },
    { name: "Porsche", continent: "Boxster", language: 72000 },
  ]);

  const [columnDefs] = useState([
    { field: "id", width: 10 },
    { field: "email" },
    { field: "body" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      autoHeight: true,
    };
  }, []);

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };
  const containerStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridStyle = useMemo(
    () => ({ height: "100%", width: "100%", padding: "20px" }),
    []
  );
  const [data, setData] = useState<any[]>([]);
  // https://jsonplaceholder.typicode.com/comments?postId=1
  useEffect(() => {
    fetchData(props.data.userId);
  }, [props.data.userId]);

  const fetchData = async (params: any) => {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${params}`
    )
      .then((response) => response.json())
      .then((json) => setData(json));
  };

  const loadingCellRenderer = useMemo<any>(() => {
    return CustomLoadingCellRenderer;
  }, []);
  const loadingCellRendererParams = useMemo<any>(() => {
    return {
      loadingMessage: "loading",
    };
  }, []);

  const [show, setShow] = useState(false);

  return (
    <div className="full-width-panel" style={containerStyle}>
      {/* <button
        onClick={() => {
          setShow(!show);
          console.log(props);
        }}
      >
      </button> */}
      {props.data.name}
      {/* {props.node.rowIndex} */}
      <div className="ag-theme-alpine " style={gridStyle}>
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={data}
          loadingCellRenderer={loadingCellRenderer}
          loadingCellRendererParams={loadingCellRendererParams}
          columnDefs={columnDefs}
          animateRows={true}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};
