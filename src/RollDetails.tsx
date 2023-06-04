import { createQuery } from "@tanstack/solid-query";
import { ClientResponseError } from "pocketbase";
import { BsDice6 } from "solid-icons/bs";
import { FiLoader, FiX } from "solid-icons/fi";
import { Match, Switch, createEffect } from "solid-js";
import toast from "solid-toast";
import { getRoll } from "./lib/api";
import { ROLLS_COLLECTION } from "./lib/pocketbase";
import { AnyRoll } from "./lib/types";

const RollDetails = ({
  rollId,
  onClose,
}: {
  rollId?: string;
  onClose: () => void;
}) => {
  let dialogRef: HTMLDialogElement | null = null;
  const roll = createQuery<AnyRoll, ClientResponseError>(
    () => [ROLLS_COLLECTION, rollId],
    () => getRoll(rollId!),
    {
      enabled: !!rollId,
    }
  );

  createEffect(() => {
    if (!!rollId) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  createEffect(() => {
    if (roll.isError) {
      toast.error(roll.error.message || "Error fetching roll data");
    }
  });

  return (
    <Switch>
      <Match when={roll.isError}>
        <></>
      </Match>
      <Match when={!roll.isError}>
        <dialog
          ref={(el) => (dialogRef = el)}
          classList={{
            "backdrop:bg-purple-900 backdrop:bg-opacity-80": true,
            "w-10/12 h-5/6 sm:w-5/12 sm:h-1/2": true,
            "p-0 rounded shadow-black": true,
          }}
        >
          <div class="w-full h-full p-0 flex flex-col rounded">
            <div class="flex items-center justify-between flex-grow-0 bg-cyan-700 text-white px-3 py-2">
              <h2 class="text-lg font-medium flex items-center space-x-2">
                <span>Roll Details</span> <BsDice6 />
              </h2>
              <button class="appearance-none" title="Cancel" onClick={onClose}>
                <FiX size={24} />
              </button>
            </div>

            <Switch>
              <Match when={roll.isLoading}>
                <div class="w-full h-full flex items-center justify-center">
                  <FiLoader class="animate-spin text-gray-300" size={48} />
                </div>
              </Match>
              <Match when={roll.isSuccess}>
                <pre class="p-5 text-sm">
                  {JSON.stringify(roll.data!, null, 2)}
                </pre>
              </Match>
            </Switch>
          </div>
        </dialog>
      </Match>
    </Switch>
  );
};

export default RollDetails;
