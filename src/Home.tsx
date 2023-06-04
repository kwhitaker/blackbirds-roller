import { Navigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { ClientResponseError, ListResult } from "pocketbase";
import { FiLoader } from "solid-icons/fi";
import { For, Match, Show, Switch, createEffect } from "solid-js";
import toast, { Toaster } from "solid-toast";
import RollDetails from "./RollDetails";
import { RollModal } from "./RollModal";
import { getRolls, useUser } from "./lib/api";
import { ROLLS_COLLECTION } from "./lib/pocketbase";
import { AnyRoll, DieType, isSkillRoll } from "./lib/types";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useUser();
  const rolls = createQuery<ListResult<AnyRoll>, ClientResponseError>(
    () => [ROLLS_COLLECTION],
    () => getRolls(),
    {
      enabled: user.data !== null,
    }
  );

  createEffect(() => {
    if (rolls.isError) {
      toast.error(rolls.error?.message || "Error fetching rolls!");
    }
  });

  const columns: ColumnDef<AnyRoll>[] = [
    {
      accessorKey: "notes.roller",
      cell: (info) => info.getValue() || "---",
      header: () => "Roller",
    },
    {
      accessorKey: "die",
      cell: (info) => {
        const type = info.getValue() as DieType;
        switch (type) {
          case "d6":
            return "Damage or Od";
          case "d10":
            return "Other";
          case "d100":
            return "Skill";
        }
      },
      header: () => "Roll Type",
    },
    {
      id: "roll",
      accessorFn: (original) =>
        isSkillRoll(original.output)
          ? original.output.parsedRoll
          : original.output.total,
      cell: (info) => info.getValue(),
      header: () => "Roll",
    },
    {
      accessorKey: "output.target",
      cell: (info) => info.getValue() || "---",
      header: () => "Target",
    },
    {
      accessorKey: "output.isSuccess",
      cell: (info) => (info.getValue() ? "Success" : "Failure"),
      header: () => "Success",
    },
  ];

  const table = createSolidTable({
    get data() {
      return rolls.data?.items || [];
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (r) => r.id,
  });

  return (
    <Switch>
      <Match when={user.data !== null}>
        <Switch>
          <Match when={rolls.isLoading}>
            <div class="w-full h-full flex items-center justify-center">
              <FiLoader class="animate-spin text-gray-300" size={48} />
            </div>
          </Match>
          <Match when={rolls.isError}>
            <div>Error! {rolls.error?.message}</div>
          </Match>
          <Match when={rolls.isSuccess}>
            <div>
              <RollModal />

              <Show when={!!searchParams["id"]}>
                <RollDetails
                  rollId={searchParams["id"]}
                  onClose={() => setSearchParams({ id: undefined })}
                />
              </Show>

              <table class="w-full border border-gray-200">
                <thead>
                  <For each={table.getHeaderGroups()}>
                    {(hg) => (
                      <tr>
                        <For each={hg.headers}>
                          {(h, idx) => (
                            <th
                              class={
                                idx() === 0 || idx() === 1
                                  ? "hidden sm:table-cell"
                                  : ""
                              }
                            >
                              <div class="px-3 py-2 flex items-center bg-gray-200 ">
                                {flexRender(
                                  h.column.columnDef.header,
                                  h.getContext()
                                )}
                              </div>
                            </th>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </thead>

                <tbody>
                  <For each={table.getRowModel().rows}>
                    {(r) => (
                      <tr
                        class="even:bg-gray-100 cursor-pointer hover:bg-purple-100"
                        role="button"
                        onClick={() => {
                          setSearchParams({ id: r.id });
                        }}
                      >
                        <For each={r.getVisibleCells()}>
                          {(c, idx) => (
                            <td
                              class={
                                idx() === 0 || idx() === 1
                                  ? "hidden sm:table-cell"
                                  : ""
                              }
                            >
                              <div class="px-3 py-2">
                                {flexRender(
                                  c.column.columnDef.cell,
                                  c.getContext()
                                )}
                              </div>
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                  {rolls.data?.totalItems === 0 && (
                    <tr>
                      <td colSpan={table.getAllColumns().length}>
                        <div class="px-3 py-2 text-lg text-center">
                          No Rolls!
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Toaster position="top-center" />
            </div>
          </Match>
        </Switch>
      </Match>
      <Match when={user.data === null}>
        <Navigate href="/login" />
      </Match>
    </Switch>
  );
};

export default Home;
