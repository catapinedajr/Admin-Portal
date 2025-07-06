import React, { useState } from "react";
import MoreSection from "@/components/sections/MoreSection";

type MoreSubTab = "store" | "conviction";

export default function MorePage() {
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>("store");

  return (
    <MoreSection 
      moreSubTab={moreSubTab}
      setMoreSubTab={setMoreSubTab}
    />
  );
}