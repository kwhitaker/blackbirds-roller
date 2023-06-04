import { Component, JSX, mergeProps } from "solid-js";

const defaultClasses = {
  "flex items-center justify-center space-x-2": true,
  "px-5 py-2": true,
  rounded: true,
  "bg-purple-400 hover:bg-purple-800 disabled:bg-purple-200": true,
  "text-white": true,
  "transition duration-100": true,
  "cursor-pointer disabled:cursor-not-allowed": true,
};

const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  const classList = mergeProps(defaultClasses, props.classList);

  return (
    <button
      class={props.class}
      classList={classList}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props?.children}
    </button>
  );
};

export default Button;
