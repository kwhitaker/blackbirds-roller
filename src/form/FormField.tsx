import { Component, JSX, mergeProps } from "solid-js";

const defaultClasses = {
  "my-3": true,
  "w-full": true,
};

const FormField: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const classList = mergeProps(defaultClasses, props.classList);

  return (
    <div class={props.class} classList={classList}>
      {props.children}
    </div>
  );
};

export default FormField;
