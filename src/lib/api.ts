import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import {
  ClientResponseError,
  ListResult,
  RecordAuthResponse,
} from "pocketbase";
import { ROLLS_COLLECTION, USERS_COLLECTION, client } from "./pocketbase";
import {
  AnyRoll,
  AnyRollPayload,
  ExplodingRoll,
  SkillRoll,
  User,
  dieTypeLabels,
  isSkillRoll,
} from "./types";

const submitLogin = async (email: string, password: string) =>
  await client
    .collection(USERS_COLLECTION)
    .authWithPassword<User>(email, password);

export const useLogin = () => {
  const qClient = useQueryClient();

  return createMutation<
    RecordAuthResponse<User>,
    ClientResponseError,
    { email: string; password: string }
  >([USERS_COLLECTION], ({ email, password }) => submitLogin(email, password), {
    onSuccess() {
      qClient.resetQueries([USERS_COLLECTION]);
    },
  });
};

export const useLogout = () => {
  const qClient = useQueryClient();

  return createMutation<null, void>(
    [USERS_COLLECTION],
    async () => {
      client.authStore.clear();
      return null;
    },
    {
      onSuccess() {
        qClient.resetQueries([USERS_COLLECTION]);
      },
    }
  );
};

export const useUser = () =>
  createQuery<User | null, Error>(
    () => [USERS_COLLECTION],
    () => client.authStore.model as unknown as User,
    {
      initialData: () =>
        client.authStore.isValid
          ? (client.authStore.model as unknown as User)
          : null,
      refetchOnWindowFocus: false,
    }
  );

const submitRoll = async (payload: AnyRollPayload) =>
  await client.collection(ROLLS_COLLECTION).create<AnyRoll>(payload);

export const useSubmitRoll = () => {
  const qClient = useQueryClient();

  return createMutation<AnyRoll, ClientResponseError, AnyRollPayload>(
    [ROLLS_COLLECTION],
    (payload: AnyRollPayload) => submitRoll(payload),
    {
      onMutate: async (vars) => {
        await qClient.cancelQueries([ROLLS_COLLECTION]);
        const previous = qClient.getQueryData<ListResult<SkillRoll[]>>([
          ROLLS_COLLECTION,
        ]);

        const optimistic = {
          ...vars,
          created: new Date().toISOString(),
        };

        qClient.setQueryData([ROLLS_COLLECTION], {
          ...previous,
          items: previous?.items
            ? [optimistic, ...previous.items]
            : [optimistic],
        });

        return { previous };
      },
      onError: (_1, _2, context) => {
        qClient.setQueryData([ROLLS_COLLECTION], (context as any).previous);
      },
      onSettled() {
        qClient.invalidateQueries([ROLLS_COLLECTION]);
      },
      async onSuccess(roll) {
        await sendRollToDiscord(roll);
      },
    }
  );
};

export const getRolls = async (page = 1, perPage = 25, sort = "-created") =>
  await client.collection(ROLLS_COLLECTION).getList<AnyRoll>(page, perPage, {
    sort,
  });

export const getRoll = async (id: string) =>
  await client.collection(ROLLS_COLLECTION).getOne<AnyRoll>(id);

async function sendRollToDiscord(roll: AnyRoll) {
  if (!import.meta.env.VITE_DISCORD_WEBHOOK_URL) {
    return;
  }

  const { notes } = roll;
  const title = `${notes.roller || "Someone"} made a roll!`;
  const rollType = dieTypeLabels[roll.die];

  const fields: Record<string, string | number | boolean>[] = [];
  let msgs: Record<string, string | number | boolean>[];

  if (isSkillRoll(roll.output)) {
    msgs = [
      {
        name: "Target",
        value: `${roll.output.target}`,
        inline: true,
      },

      {
        name: "Result",
        value: `${roll.output.parsedRoll}`,
        inline: true,
      },

      {
        name: "Success?",
        value: roll.output.isSuccess ? ":white_check_mark:" : ":no_entry:",
        inline: true,
      },
      {
        name: "",
        value: "",
      },
      {
        name: "Critical?",
        value: roll.output.isCritical ? ":boom:" : ":no_entry:",
        inline: true,
      },
      {
        name: "Sublime?",
        value: roll.output.isCritical ? ":skull:" : ":no_entry:",
        inline: true,
      },
    ];
  } else {
    msgs = [
      {
        name: "Die",
        value: `${roll.die}`,
        inline: true,
      },
      {
        name: "Num. Dice",
        value: `${roll.output.rolls.length}`,
        inline: true,
      },
      {
        name: "Modifier",
        value: `${roll.output.modifier}`,
        inline: true,
      },
      {
        name: "Total",
        value: `${roll.output.total}`,
        inline: true,
      },
      roll.die === "d6"
        ? {
            name: "Exploded?",
            value:
              (roll as ExplodingRoll).output.initialRolls.length <
              (roll as ExplodingRoll).output.rolls.length
                ? ":boom:"
                : ":no_entry:",
          }
        : ({} as any),
    ];
  }

  fields.push(...msgs);

  const msg = {
    username: "Blackbirds Roller",
    avatar_url: "https://api.dicebear.com/6.x/bottts-neutral/png?seed=Angel",
    content: title,
    channel_id: import.meta.env.VITE_DISCORD_CHANNEL_ID,
    embeds: [
      {
        author: {
          name: notes.roller || "Someone",
          icon_url:
            "https://api.dicebear.com/6.x/bottts-neutral/png?seed=Angel",
        },
        title: `${rollType}`,
        url: "http://blackbirdsroller.com/?id=" + roll.id,
        fields,
      },
    ],
  };

  try {
    await fetch(import.meta.env.VITE_DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
  } catch (e) {
    throw e;
  }
}
