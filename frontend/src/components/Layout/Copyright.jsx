import React from "react";

const Copyright = () => {
  return (
    <div className="bg-slate-800 text-slate-400 text-center py-3 text-sm shadow-inner">
      © {new Date().getFullYear()} Petstuff Store. All rights reserved.
    </div>
  );
};

export default Copyright;
