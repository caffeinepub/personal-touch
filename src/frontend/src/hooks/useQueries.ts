import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContactCategory } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useContacts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["contacts", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getContactsByUser(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useContactsByCategory(category: ContactCategory | "all") {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["contacts", identity?.getPrincipal().toString(), category],
    queryFn: async () => {
      if (!actor || !identity) return [];
      if (category === "all") {
        return actor.getContactsByUser(identity.getPrincipal());
      }
      return actor.getContactsByUserAndCategory(
        identity.getPrincipal(),
        category,
      );
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useMeetingNotes(contactId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["meetingNotes", contactId?.toString()],
    queryFn: async () => {
      if (!actor || contactId === null) return [];
      return actor.getMeetingNotesByContact(contactId);
    },
    enabled: !!actor && !isFetching && contactId !== null,
  });
}

export function useCreateContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      name,
      category,
    }: { name: string; category: ContactCategory }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createContact(name, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useCreateMeetingNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      date,
      summary,
    }: { contactId: bigint; date: string; summary: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createMeetingNote(contactId, date, summary);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meetingNotes", variables.contactId.toString()],
      });
    },
  });
}

export function useUpdateMeetingNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      summary,
      contactId: _contactId,
    }: { id: bigint; summary: string; contactId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMeetingNote(id, summary);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meetingNotes", variables.contactId.toString()],
      });
    },
  });
}

export function useSummarizeText() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.summarizeText(text);
    },
  });
}

export function useLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.login(name);
    },
  });
}

export { ContactCategory };
