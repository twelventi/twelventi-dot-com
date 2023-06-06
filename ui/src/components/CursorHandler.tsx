import {
  createContext,
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { WS_URL } from "../static";
import ReactCountryFlag from "react-country-flag";

type Message = {
  event: string;
  userid: string;
  fl: string;
  x: number;
  y: number;
};

export const EnabledCursorContext = createContext([true, (val: boolean) => {}]);

export function CursorHandler({ children }: PropsWithChildren) {
  const [enabledCursors, setEnabledCursors] = useContext(EnabledCursorContext);

  const [cursors, setCursors] = useState<
    Record<string, { x: number; y: number; fl: string }>
  >({});

  const onMessage = useCallback(
    (ev: MessageEvent<any>) => {
      if (enabledCursors) {
        const data: Message = JSON.parse(ev.data);
        if (data.event === "update") {
          const x = window.innerWidth / 2 + data.x;
          const y = window.innerHeight / 2 + data.y;
          if (
            x > window.innerWidth ||
            y > window.innerHeight ||
            x < -20 ||
            y < -20
          ) {
            delete cursors[data.userid];
          } else {
            cursors[data.userid] = {
              x,
              y,
              fl: data.fl,
            };
          }
        }
        if (data.event === "close") {
          delete cursors[data.userid];
        }
        setCursors(cursors);
      }
    },
    [enabledCursors, cursors]
  );

  const ws = useWebSocket(WS_URL, {
    onMessage: onMessage,
  });

  const [prevMove, setPrevMove] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const onMouseMove: MouseEventHandler = useCallback(
    (ev: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      const x = ev.clientX - window.innerWidth / 2;
      const y = ev.clientY - window.innerHeight / 2;
      const move = {
        x,
        y,
      };

      //if the new updated position is the same there's
      //no use updating the server
      if (prevMove.x == x && prevMove.y == y) {
        return;
      }

      ws?.sendJsonMessage(move);
      setPrevMove(move);
    },
    [ws, prevMove]
  );
  return (
    <div onMouseMove={onMouseMove} className="overflow-x-none">
      {enabledCursors &&
        Object.keys(cursors).map((key) => {
          const coords = cursors[key];
          console.log(coords.fl);
          return (
            <span
              className="absolute pointer-events-none"
              style={{ top: coords.y, left: coords.x }}
              key={key}
            >
              <ReactCountryFlag countryCode={coords.fl} svg />
            </span>
          );
        })}
      {children}
    </div>
  );
}
