import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        "bg-slate-800 px-4 py-2 rounded-md text-sm text-slate-100",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
