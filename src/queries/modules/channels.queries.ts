import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { channelsModule } from "@/api/modules/channels.module";
import { queryKeys } from "@/queries/keys";
import type { ApiError } from "@/api/client";
import type {
  AddChannelMemberRequest,
  ChannelMembersListParams,
  ChannelMembersResponse,
  ChannelListParams,
  ChannelListResponse,
  ChannelSummary,
  CreateChannelRequest,
} from "@/types/api.types";

type CreateChannelInput = {
  workspaceId: string;
  payload: CreateChannelRequest;
};

type AddChannelMemberInput = {
  workspaceId: string;
  channelId: string;
  payload: AddChannelMemberRequest;
};

const defaultChannelListParams = {
  limit: 100,
  includeArchived: false,
} satisfies ChannelListParams;

const defaultChannelMembersListParams = {
  limit: 100,
  includeArchived: false,
} satisfies ChannelMembersListParams;

export function useWorkspaceChannels(
  workspaceId?: string | null,
  params: ChannelListParams = defaultChannelListParams,
) {
  return useQuery<ChannelListResponse, ApiError>({
    queryKey: workspaceId
      ? queryKeys.channels.list(workspaceId, params)
      : queryKeys.channels.list("missing-workspace", params),
    queryFn: () => channelsModule.list(workspaceId as string, params),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useChannelDetail(
  workspaceId?: string | null,
  channelId?: string | null,
  initialChannel?: ChannelSummary | null,
) {
  return useQuery<ChannelSummary, ApiError>({
    queryKey:
      workspaceId && channelId
        ? queryKeys.channels.detail(workspaceId, channelId)
        : queryKeys.channels.detail("missing-workspace", "missing-channel"),
    queryFn: () => channelsModule.getById(workspaceId as string, channelId as string),
    enabled: Boolean(workspaceId && channelId),
    initialData: initialChannel ?? undefined,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useChannelMembers(
  workspaceId?: string | null,
  channelId?: string | null,
  params: ChannelMembersListParams = defaultChannelMembersListParams,
) {
  return useQuery<ChannelMembersResponse, ApiError>({
    queryKey:
      workspaceId && channelId
        ? queryKeys.channels.membersList(workspaceId, channelId, params)
        : queryKeys.channels.membersList("missing-workspace", "missing-channel", params),
    queryFn: () => channelsModule.listMembers(workspaceId as string, channelId as string, params),
    enabled: Boolean(workspaceId && channelId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useCreateChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation<ChannelSummary, ApiError, CreateChannelInput>({
    mutationFn: ({ workspaceId, payload }) => channelsModule.create(workspaceId, payload),
    onSuccess: (channel, variables) => {
      queryClient.setQueryData<ChannelListResponse>(
        queryKeys.channels.list(variables.workspaceId, defaultChannelListParams),
        (current) => {
          if (!current) {
            return {
              count: 1,
              channels: [channel],
            };
          }

          if (current.channels.some((item) => item.id === channel.id)) {
            return current;
          }

          return {
            ...current,
            count: current.count + 1,
            channels: [channel, ...current.channels],
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.channels.lists(variables.workspaceId),
      });
      toast.success(`#${channel.name} created`, {
        description: "Channel is ready for your team.",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Could not create channel.");
    },
  });
}

export function useAddChannelMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, AddChannelMemberInput>({
    mutationFn: ({ workspaceId, channelId, payload }) =>
      channelsModule.addMember(workspaceId, channelId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.channels.members(variables.workspaceId, variables.channelId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.channels.detail(variables.workspaceId, variables.channelId),
      });
      toast.success("Member added", { description: "Channel membership updated." });
    },
    onError: (error) => {
      toast.error(error.message || "Could not add member.");
    },
  });
}
