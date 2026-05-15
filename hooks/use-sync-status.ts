/**
 * Sync Status Hook
 * Tracks integration sync status and provides manual sync trigger
 */

import { fetchSyncStatus, triggerSync } from '@/services/events';
import type { SyncStatus } from '@/services/mock-data';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSyncStatus() {
  const queryClient = useQueryClient();

  const statusQuery = useQuery<SyncStatus>({
    queryKey: ['syncStatus'],
    queryFn: fetchSyncStatus,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  const syncMutation = useMutation({
    mutationFn: (integration: 'grafana' | 'github') => triggerSync(integration),
    onSuccess: () => {
      // Invalidate both sync status and events after manual sync
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  // Format "last synced" as relative time
  const formatLastSynced = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return {
    status: statusQuery.data,
    isLoading: statusQuery.isLoading,
    isError: statusQuery.isError,
    error: statusQuery.error,
    refetch: statusQuery.refetch,
    triggerSync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    formatLastSynced,
  };
}
