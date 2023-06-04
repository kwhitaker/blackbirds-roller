import { IFormControl } from "solid-forms";
import { For, Show, type Component } from "solid-js";

const FormToggleButton: Component<{
  control: IFormControl<boolean>;
  name: string;
  label: string;
  wrapperClass?: string;
}> = (props) => {
  return (
    <div class={`relative flex-grow ${props.wrapperClass || ""}`}>
      <label
        for={props.name}
        onClick={(e) => props.control?.setValue(!props.control.value)}
        classList={{
          "flex items-center justify-center": true,
          "px-3 py-2": true,
          "bg-purple-400 hover:bg-purple-800 disabled:bg-purple-200": true,
          "text-white disabled:text-black disabled:text-opacity-70": true,
          "cursor-pointer disabled:cursor-not-allowed": true,
          "transition duration-100": true,
          rounded: true,
          "bg-purple-800": !!props.control.value,
        }}
      >
        {props.label}
        <input
          name={props.name}
          type="checkbox"
          checked={props.control?.value}
          onChange={(e) => props.control?.setValue(e.currentTarget.checked)}
          onBlur={() => props.control?.markTouched(true)}
          required={props.control?.isRequired}
          disabled={props.control?.isDisabled}
          class="w-1 h-1 absolute -left-[9999px]"
        />
      </label>

      <Show when={props.control?.isTouched && !props.control?.isValid}>
        <For each={Object.values(props.control!.errors!)}>
          {(errMsg) => <small>{errMsg}</small>}
        </For>
      </Show>
    </div>
  );
};

export default FormToggleButton;
