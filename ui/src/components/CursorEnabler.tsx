import { PropsWithChildren, useCallback } from "react";
import { BsCursor, BsCursorFill } from "react-icons/bs";

export function CursorEnabler({
  enabledCursors,
  setEnabledCursors,
}: PropsWithChildren<{
  enabledCursors: boolean;
  setEnabledCursors: (val: boolean) => {};
}>) {
  const onClick = useCallback(() => {
    setEnabledCursors(!enabledCursors);
  }, [enabledCursors]);
  return (
    <div
      onClick={onClick}
    data-tooltip-id="tt"
      data-tooltip-content={`${
        enabledCursors ? "Disable" : "Enable"
      } displaying other cursors`}
      className="hover:cursor-pointer"
    >
      {enabledCursors ? <BsCursorFill /> : <BsCursor />}
    </div>
  );
}
