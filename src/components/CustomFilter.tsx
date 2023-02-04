import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import AscIcon from "../assets/AscIcon.svg";
import DescIcon from "../assets/DescIcon.svg";
import customSort from "../assets/customSort.svg";

export default forwardRef((props: any, ref) => {
  const [filterText, setFilterText] = useState<string | undefined>(undefined);

  const [filterCheckBoxData, setFilterCheckBoxData] = useState<any[]>([]);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        const { api, colDef, column, columnApi, context } = props;
        const { node } = params;

        // make sure each word passes separately, ie search for firstname, lastname
        let passed = true;
        if (filterText) {
          filterText
            .toLowerCase()
            .split(" ")
            .forEach((filterWord) => {
              const value = props.valueGetter({
                api,
                colDef,
                column,
                columnApi,
                context,
                data: node.data,
                getValue: (field: any) => node.data[field],
                node,
              });

              if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                passed = false;
              }
            });
        }

        return passed;
      },

      isFilterActive() {
        return filterText != null && filterText !== "";
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null;
        }

        return { value: filterText };
      },

      setModel(model: any) {
        setFilterText(model == null ? null : model.value);
      },
    };
  });

  const onChange = (event: any) => {
    setFilterText(event.target.value);
  };

  useEffect(() => {
    props.filterChangedCallback();
  }, [filterText]);

  const sortByAscending = useCallback(() => {
    props!.columnApi.applyColumnState({
      state: [{ colId: "name", sort: "asc" }],
      defaultState: { sort: null },
    });
  }, []);

  const sortByDescending = useCallback(() => {
    props!.columnApi.applyColumnState({
      state: [{ colId: "name", sort: "desc" }],
      defaultState: { sort: null },
    });
  }, []);

  const onCheckBoxChange = (event: any) => {
    const { checked, value } = event.target;
    if (checked) {
      setFilterCheckBoxData([...filterCheckBoxData, value]);
    } else {
      setFilterCheckBoxData(
        filterCheckBoxData.filter((item) => item !== value)
      );
    }
  };

  return (
    <div style={{ padding: 4, width: 200 }}>
      <div className="custom-sorting">
        <img src={AscIcon} alt="" />
        <p onClick={sortByAscending}>Sort Ascending</p>
      </div>
      <div className="custom-sorting">
        <img src={DescIcon} alt="" />
        <p onClick={sortByDescending}>Sort Descending</p>
      </div>
      <hr className="hrStyle" />
      <div className="custom-sorting">
        <img src={customSort} alt="" />
        <p>Custom Filter</p>
      </div>
      <hr className="hrStyle" />
      <div>
        <input
          style={{ margin: "4 0 4 0" }}
          type="text"
          value={filterText}
          onChange={onChange}
          placeholder="search"
          className="custom-search"
        />
      </div>
      {/* select all checkbox */}
      <div>
        <div className="checkbox-container">
          <div className="custom-checkboxes">
            <input
              type="checkbox"
              className="custom-checkbox"
              onChange={(e) => {
                props.rowModel.rowsToDisplay.forEach((row: any) => {
                  row.setSelected(e.target.checked);
                });
              }}
            />
            <p>Select All</p>
          </div>
          {props.rowModel.rowsToDisplay.map((row: any) => {
            return (
              <div className="custom-checkboxes" key={row.id}>
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  value={row.data.name}
                  onChange={onCheckBoxChange}
                />
                <p>{row.data.name}</p>
              </div>
            );
          })}
        </div>
        <div className="custom-button-container">
          <button className="custom-cancel">Cancel</button>
          <button
            className="custom-apply"
            onClick={() => {
              props.rowModel.rowsToDisplay.forEach((row: any) => {
                row.setSelected(false);
              });
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
});
