import React from "react";

interface CardArchitectureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CardArchitecture = ({
  icon,
  title,
  description,
}: CardArchitectureProps) => {
  return (
    <div className="w-full max-w-sm min-h-[201px] h-full bg-dataflow-graydark rounded-2xl shadow-lg border border-dataflow-graylight/20 p-8 hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <p className="text-dataflow-graysuperlight/70 text-sm font-normal mt-4">
        {description}
      </p>
    </div>
  );
};

export default CardArchitecture;
