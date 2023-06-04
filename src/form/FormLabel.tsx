import { Component, JSX, mergeProps } from "solid-js";

const defaultClasses = {
  "mb-2 text-sm font-semibold text-gray-600": true,
};

const FormLabel: Component<JSX.LabelHTMLAttributes<HTMLLabelElement>> = (
  props
) => {
  const classList = mergeProps(defaultClasses, props.classList);

  return (
    <label for={props.for} class={props.class} classList={classList}>
      {props.children}
    </label>
  );
};

export default FormLabel;
