import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import InAppPopup, { PopupType } from "../components/InAppPopup";

interface PopupContextType {
  showPopup: (message: string, type?: PopupType) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within PopupProvider");
  return ctx;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<{
    visible: boolean;
    message: string;
    type: PopupType;
  }>({ visible: false, message: "", type: "notification" });

  const showPopup = useCallback((message: string, type: PopupType = "notification") => {
    setPopup({ visible: true, message, type });
  }, []);

  const handleHide = useCallback(() => {
    setPopup((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {/* InAppPopup is always mounted, but only visible when needed */}
      <InAppPopup
        visible={popup.visible}
        message={popup.message}
        type={popup.type}
        onHide={handleHide}
      />
    </PopupContext.Provider>
  );
};
