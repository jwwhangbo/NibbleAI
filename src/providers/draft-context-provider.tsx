'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";
import invariant from "tiny-invariant";

interface DraftContextType {
  draftIdState: number | undefined;
  setDraftIdState: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export const DraftProvider = ({
  children,
  initialDraftId,
}: {
  children: ReactNode;
  initialDraftId?: number;
}) => {
  const [draftIdState, setDraftIdState] = useState<number | undefined>(
    initialDraftId
  );

  return (
    <DraftContext.Provider value={{ draftIdState, setDraftIdState }}>
      {children}
    </DraftContext.Provider>
  );
};

export const useDraft = () => {
  const context = useContext(DraftContext);
  invariant(
    context !== undefined,
    "useDraft must be used within a DraftProvider"
  );
  return context;
};
