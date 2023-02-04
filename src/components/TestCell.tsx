import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ICellRendererParams } from "ag-grid-community";
import arrowRight from "../assets/arrow-right.svg";
import arrowDown from "../assets/arrow-down.svg";
import { AgGridReact } from "ag-grid-react";
export default (props: ICellRendererParams) => {
  function createNewRowData() {
    const newData = [
      {
        name: props.data.name,
        continent: props.data.continent,
        language: props.data.language,
        expanded: true,
        fullRow: true,
        userId: Number(props.node.id) + 1,
      },
    ];
    return newData;
  }
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
    };
  }, []);
  const addItems = useCallback((addIndex: number | undefined) => {
    console.log("addIndex", addIndex);
    const newItems = createNewRowData();
    const res = props.api.applyTransaction({
      add: newItems,
      addIndex: addIndex,
    })!;

    // divElemnt.innerHTML = (
    //   <AgGridReact
    //     defaultColDef={defaultColDef}
    //     rowData={rowData}
    //     columnDefs={columnDefs}
    //   ></AgGridReact>
    // );
    // props.eGridCell.offsetParent.appendChild(divElemnt);
  }, []);

  const removeItems = useCallback(
    (removeIndex: number | undefined) => {
      console.log("removeIndex", removeIndex);
      const res = props.api.applyTransaction({
        remove: [props.node.parent.childrenAfterSort[removeIndex].data],
      })!;
    },
    [props.node.parent.childrenAfterSort]
  );
  console.log(props);
  const [addRemove, setAddRemove] = React.useState(true);
  return (
    <div className="add-button">
      <>
        {addRemove && (
          <img
            src={arrowRight}
            onClick={() => {
              addItems(props.node.rowIndex + 1);
              // console.log(
              //   props.node.rowIndex,
              //   props.node.parent.childrenAfterSort
              // );
              setAddRemove(!addRemove);
            }}
            alt=""
          />
        )}
        {!addRemove && (
          <img
            src={arrowDown}
            onClick={() => {
              removeItems(props.node.rowIndex + 1);

              setAddRemove(!addRemove);
            }}
            alt=""
          />
        )}
      </>
      {props.value}
    </div>
  );
};
