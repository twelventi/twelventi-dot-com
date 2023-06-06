import { Routing } from "./Routing";
import { QueryClient, QueryClientProvider } from "react-query";
import { WS_URL } from "./static";
import {
  createContext,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MouseEvent } from "react";
import { FaAmazon, FaMagento } from "react-icons/fa";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { Tooltip } from "react-tooltip";
import {
  CursorHandler,
  EnabledCursorContext,
} from "./components/CursorHandler";

function App() {
  const queryClient = new QueryClient();
  const [enabledCursors, setEnabledCursors] = useState(true);

  return (
    <>
      <EnabledCursorContext.Provider
        value={[enabledCursors, setEnabledCursors]}
      >
        <CursorHandler>
          <QueryClientProvider client={queryClient}>
            <Routing></Routing>
          </QueryClientProvider>
        </CursorHandler>
      </EnabledCursorContext.Provider>
      <Tooltip id="tt" />
    </>
  );
}

export default App;
