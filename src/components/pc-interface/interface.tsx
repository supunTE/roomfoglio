import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { assets } from "../../assets";
import { useBreakpoint } from "../../hooks";

import { usePCIconsGrid } from "./utils/pc-icons-grid.util";
import { Cursor } from "./cursor";
import { useInterfaceImageLoader, useMouseCursorMove } from "./hooks";
import { InterfaceLoading } from "./interface.loading";
import { PCIcon } from "./PCIcon";
import { StatusBar } from "./statusBar";
import { iconUrls, useWindowManagerStore } from "./store";
import { Taskbar } from "./taskbar";
import { windows } from "./windows";

export function Interface() {
  const windowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const { isSm } = useBreakpoint("sm");

  const isInterfaceImagesLoaded = useInterfaceImageLoader();
  const { colsNum, rowsNum } = usePCIconsGrid({
    windowRef,
    isInterfaceImagesLoaded,
  });

  useMouseCursorMove({
    windowRef,
    cursorRef,
    isInterfaceImagesLoaded,
  });

  const clickedIcon = useState<string>("");
  const [_clickedIconName, setClickedIcon] = clickedIcon;

  const state = useWindowManagerStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const activeWindowsParam = searchParams.get("activeWindows");
    const allWindowsParam = searchParams.get("allWindows");

    console.log(activeWindowsParam, "activeWindowsParam");
    console.log(allWindowsParam, "allWindowsParam");

    if (allWindowsParam) {
      const allWindows = allWindowsParam.split(",");
      const activeWindows = activeWindowsParam.split(",") || [];

      console.log(allWindows, "allWindows");
      console.log(activeWindows, "activeWindows");

      // Remove windows that are not in iconUrls
      const filteredAllWindows = allWindows.filter((window) =>
        Object.keys(iconUrls).includes(window)
      );
      const filteredActiveWindows = activeWindows.filter((window) =>
        Object.keys(iconUrls).includes(window)
      );

      state.replaceWindows(filteredActiveWindows, filteredAllWindows);
    }
  }, []);

  const addItemToOpenedWindows = (item: string) => {
    state.openWindow(item);
  };

  const navigate = useNavigate();

  if (!isInterfaceImagesLoaded) return <InterfaceLoading />;

  return (
    <>
      <div
        ref={windowRef}
        className="bg-cover rounded-xl shadow-sm border overflow-hidden border-gray-200 w-full h-full flex flex-col relative"
        style={{ backgroundImage: `url(${assets.desktopBackground})` }}
        onClick={() => {
          setClickedIcon("");
        }}
      >
        <Cursor ref={cursorRef} />

        {!isSm && <StatusBar />}

        <div
          className="flex-1 relative grid justify-items-center items-start gap-2 p-4"
          style={{
            gridTemplateColumns: `repeat(${colsNum}, 1fr)`,
            gridTemplateRows: `repeat(${rowsNum}, 1fr)`,
          }}
        >
          <AnimatePresence>
            {state.activeWindows.map((window) => {
              return (
                windows[window] || (
                  <div
                    key={`window-${window}`}
                    className="bg-white/80 text-black backdrop-blur-sm rounded-md shadow-md p-4"
                  >
                    Window not found
                  </div>
                )
              );
            })}
          </AnimatePresence>

          {Object.keys(iconUrls).map((icon) => {
            if (iconUrls[icon].hide) return null;
            return (
              <PCIcon
                clickedIcon={clickedIcon}
                onOpened={(item: string) => {
                  addItemToOpenedWindows(item);
                }}
                iconKey={icon}
              />
            );
          })}

          <PCIcon
            clickedIcon={clickedIcon}
            onOpened={() => {
              navigate("/");
            }}
            iconKey={"shutdown"}
          />
        </div>
        <Taskbar />
      </div>
    </>
  );
}
