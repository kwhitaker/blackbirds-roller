import { IFormControl } from "solid-forms";
import { For, JSX, Show, mergeProps, type Component } from "solid-js";
import FormError from "./FormError";

const defaultClasses = {
  "my-2 px-3 py-2": true,
  "rounded-sm border border-gray-300": true,
  "focus:border-purple-500 active:border-purple-500": true,
  "w-full": true,
  "cursor-pointer": true,
};

interface FormSelectOption {
  label?: string;
  value?: string | number;
  disabled?: boolean;
}

const FormSelect: Component<
  JSX.SelectHTMLAttributes<HTMLSelectElement> & {
    control: IFormControl<string | number>;
    name: string;
    options: FormSelectOption[];
    wrapperClass?: string;
  }
> = (props) => {
  const classList = mergeProps(
    defaultClasses,
    {
      "border-red-500 text-red-500":
        props.control.isTouched && !props.control?.isValid,
    },
    props.classList
  );

  return (
    <div class={props.wrapperClass}>
      <select
        name={props.name}
        value={props.control?.value}
        onChange={(e) => props.control?.setValue(e.currentTarget.value)}
        onBlur={() => props.control?.markTouched(true)}
        required={props.control?.isRequired}
        disabled={props.control?.isDisabled}
        classList={classList}
      >
        <For each={props.options}>
          {({ value, label, disabled }) => (
            <option value={value} label={label} disabled={disabled}>
              {label}
            </option>
          )}
        </For>
      </select>

      <Show when={props.control?.isTouched && !props.control?.isValid}>
        <For each={Object.values(props.control!.errors!)}>
          {(errMsg) => <FormError>{errMsg}</FormError>}
        </For>
      </Show>
    </div>
  );
};

export default FormSelect;
