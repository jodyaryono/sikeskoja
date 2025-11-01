import React from "react";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  gradient?: string;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  title,
  description,
  color,
  gradient,
  href,
  onClick,
  badge,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        gradient
          ? `bg-gradient-to-br ${gradient}`
          : color
          ? `bg-gradient-to-br ${color}`
          : "bg-gradient-to-br from-gray-500 to-gray-600"
      } text-white`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      {/* Badge */}
      {badge !== undefined && (
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
          {badge}
        </div>
      )}

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-sm font-medium">
          <span className="mr-2">Mulai</span>
          <svg
            className="h-4 w-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700"></div>
    </button>
  );
};

export default QuickActionButton;
