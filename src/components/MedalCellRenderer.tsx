import React, { forwardRef, useImperativeHandle } from "react";
import { ICellRendererParams } from "ag-grid-community";

export default (props: ICellRendererParams) => {
  console.log(props);

  return (
    <span className="total-value-renderer">
      {props.data.childrens.length > 0 ? (
        <>
          <button
            onClick={() => {
              props.api.applyTransaction({
                update: [
                  {
                    ...props.data,
                    expanded: !props.data.expanded,
                  },
                ],
              });
            }}
          >
            {props.data.expanded ? "+" : "-"}
          </button>
          {props.value}
        </>
      ) : (
        <>{props.value}</>
      )}
    </span>
  );
};
