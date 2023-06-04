import { createFormControl, createFormGroup } from "solid-forms";
import { BsDice6 } from "solid-icons/bs";
import { FiX } from "solid-icons/fi";
import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import toast, { Toaster } from "solid-toast";
import Button from "./Button";
import FormField from "./form/FormField";
import FormInput from "./form/FormInput";
import FormLabel from "./form/FormLabel";
import FormSelect from "./form/FormSelect";
import FormTextArea from "./form/FormTextArea";
import FormToggleButton from "./form/FormToggleButton";
import { requiredValidator } from "./form/validators";
import { useSubmitRoll } from "./lib/api";
import { roll10, roll6, rollPerc } from "./lib/roll";
import {
  AnyRollPayload,
  DieType,
  ExplodingRollOutput,
  OtherRollOutput,
  SKillRollOutput,
  dieTypeLabels,
  dieTypes,
  isSkillRoll,
} from "./lib/types";

export const RollModal = () => {
  let dialogRef: HTMLDialogElement;
  const [show, setShow] = createSignal(false);
  const submitRoll = useSubmitRoll();

  createEffect(() => {
    if (submitRoll.isSuccess) {
      toast.success("Roll created!", { id: "form" });
    }
  });

  const formGroup = createFormGroup({
    target: createFormControl<number>(35),
    type: createFormControl<DieType>("d100", {
      validators: [requiredValidator],
    }),
    assisted: createFormControl(false),
    flipToFail: createFormControl(false),
    flipToSucceed: createFormControl(false),
    roller: createFormControl("", {
      required: true,
      validators: [requiredValidator],
    }),
    notes: createFormControl(""),
    modifier: createFormControl(0),
    numDice: createFormControl(1),
  });

  const onReset = () => {
    formGroup.setValue({
      type: "d100",
      target: 35,
      assisted: false,
      flipToFail: false,
      flipToSucceed: false,
      roller: "",
      notes: "",
      modifier: 0,
      numDice: 1,
    });

    formGroup.markDirty(false);
    formGroup.markTouched(false);
    formGroup.markSubmitted(false);
  };

  const onDismiss = (e: MouseEvent | Event) => {
    e.preventDefault();
    onReset();
    setShow(false);
  };

  createEffect(() => {
    if (show()) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  onMount(() => {
    dialogRef?.addEventListener("cancel", onDismiss);
  });

  onCleanup(() => {
    dialogRef?.removeEventListener("cancel", onDismiss);
  });

  const onSubmit = (e: Event) => {
    e.preventDefault();

    const {
      target,
      type,
      assisted,
      flipToFail,
      flipToSucceed,
      roller,
      notes,
      numDice,
      modifier,
    } = formGroup.value;

    let result: ExplodingRollOutput | SKillRollOutput | OtherRollOutput;

    switch (type) {
      case "d10":
        result = roll10(numDice, modifier);
        break;
      case "d6":
        result = roll6(numDice, modifier);
        break;
      default:
        if (!target) {
          formGroup.controls.target.setErrors({ required: true });
          return;
        }

        result = rollPerc({
          target,
          flipToFail,
          flipToSucceed,
          assisted,
        });
    }

    submitRoll.mutate({
      die: type!,
      rolls: isSkillRoll(result) ? result.roll : result.rolls,
      notes: {
        roller,
        notes,
      },
      output: result,
    } as AnyRollPayload);
  };

  return (
    <div class="w-full flex items-center justify-center mb-5  ">
      <button
        onClick={() => setShow(true)}
        class="flex items-center justify-center space-x-2 w-full px-5 py-2 rounded bg-purple-400 transition duration-100 hover:bg-purple-800 text-white"
      >
        <span>{submitRoll.isLoading ? "Rolling..." : "Gimme a Roll"}</span>
        <BsDice6 />
      </button>

      <dialog
        ref={(el) => (dialogRef = el)}
        classList={{
          "backdrop:bg-purple-900 backdrop:bg-opacity-80": true,
          "w-10/12 h-5/6 sm:w-5/12 sm:h-1/2": true,
          "p-0 rounded shadow-black": true,
        }}
      >
        <form
          class="w-full h-full p-0 flex flex-col justify-between rounded"
          onSubmit={onSubmit}
        >
          <div class="flex items-center justify-between flex-grow-0 bg-cyan-700 text-white px-3 py-2">
            <h2 class="text-lg font-medium flex items-center space-x-2">
              <span>Gimme a Roll</span> <BsDice6 />
            </h2>
            <button class="appearance-none" title="Cancel" onClick={onDismiss}>
              <FiX size={24} />
            </button>
          </div>

          <div class="flex flex-col flex-grow overflow-y-auto p-5">
            <FormField>
              <FormLabel for="type">Roll Type*</FormLabel>
              <FormSelect
                name="roller"
                control={formGroup.controls.type}
                options={[
                  ...dieTypes.map((dt) => ({
                    value: dt,
                    label: dieTypeLabels[dt],
                  })),
                ]}
              />
            </FormField>

            <Show when={formGroup.controls.type.value === "d100"}>
              <FormField>
                <FormLabel for="target">Target Number*</FormLabel>
                <FormInput
                  name="target"
                  control={formGroup.controls.target}
                  type="number"
                  min={1}
                  max={100}
                />
              </FormField>
              <FormField class="flex items-center justify-between space-x-3">
                <FormToggleButton
                  name="assisted"
                  label="Assisted?"
                  control={formGroup.controls.assisted}
                />
                <FormToggleButton
                  name="flipToSucceed"
                  label="Flip To Succeed?"
                  control={formGroup.controls.flipToSucceed}
                />
                <FormToggleButton
                  name="flipToFail"
                  label="Flip To Fail?"
                  control={formGroup.controls.flipToFail}
                />
              </FormField>
            </Show>

            <Show
              when={
                formGroup.controls.type.value !== "d100" &&
                !!formGroup.controls.type.value
              }
            >
              <FormField>
                <FormLabel for="numDice">Number of Dice*</FormLabel>
                <FormInput
                  name="numDice"
                  control={formGroup.controls.numDice}
                  type="number"
                  min={1}
                  max={20}
                />
              </FormField>
              <FormField>
                <FormLabel for="modifier">Modifier?</FormLabel>
                <FormInput
                  name="modifier"
                  control={formGroup.controls.modifier}
                  type="number"
                  min={-100}
                  max={100}
                />
              </FormField>
            </Show>

            <FormField>
              <FormLabel for="roller">Roller*</FormLabel>
              <FormInput name="roller" control={formGroup.controls.roller} />
            </FormField>
            <FormField>
              <FormLabel for="notes">Notes?</FormLabel>
              <FormTextArea name="notes" control={formGroup.controls.notes} />
            </FormField>
          </div>

          <div class="flex flex-grow-0 items-center justify-center space-x-3 px-3 py-2 border-t border-gray-300">
            <Button
              type="submit"
              disabled={!formGroup.isValid || submitRoll.isLoading}
              onClick={onSubmit}
            >
              Roll!
            </Button>
            <Button
              onClick={onDismiss}
              classList={{
                "bg-gray-500 hover:bg-gray-800 disabled:bg-gray-200": true,
                "disabled:text-gray-400": true,
              }}
            >
              Cancel
            </Button>
          </div>
          <Toaster position="top-center" toastOptions={{ id: "form" }} />
        </form>
      </dialog>
    </div>
  );
};
