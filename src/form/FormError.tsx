import { Component, JSX } from "solid-js";

const FormError: Component<JSX.HTMLAttributes<HTMLElement>> = (props) => (
  <small class="text-xs text-red-500 block">{props.children}</small>
);

export default FormError;
