import React from "react";

interface CardHowItWorksProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const CardHowItWorks = ({
  icon,
  title,
  description,
  color,
}: CardHowItWorksProps) => {
  return (
    <div className="w-full max-w-2xs h-full bg-white border border-dataflow-graylight/10 rounded-2xl shadow-sm transition-all duration-300 p-8 hover:shadow-md hover:shadow-dataflow-primary/20 hover:border-dataflow-primary">
      <div className="w-full h-full flex flex-col items-start justify-center gap-4">
        <div className="w-full h-full flex items-start justify-start">
          <div
            className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center`}
          >
            {icon}
          </div>
        </div>
        <h3 className="text-dataflow-bluelock font-bold text-xl">{title}</h3>
        <p className="text-dataflow-graylight text-sm">{description}</p>
      </div>
    </div>
  );
};

export default CardHowItWorks;
