import { ICellEditorParams } from "ag-grid-community";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
const textEditInput = memo(
  forwardRef((props: ICellEditorParams, ref) => {
    const [value, setValue] = useState(props.value);
    const refInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // focus on the input
      refInput.current?.focus();
    }, []);

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          // this simple editor doubles any value entered into the input
          return value;
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return false;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        // isCancelAfterEnd() {
        //   // our editor will reject any value greater than 1000
        //   return value > 1000;
        // },
      };
    });

    return (
      <input
        type="text"
        // className={`${styles.ag_input} ${styles.text_edit_input} `}
        ref={refInput}
        value={value}
        onChange={(event: any) => setValue(event.target.value)}
      />
    );
  })
);

export default textEditInput;
