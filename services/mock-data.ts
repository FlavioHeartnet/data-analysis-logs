/**
 * Mock data for ObservaSync
 * Simulates backend responses for Phases 1-2
 */

export type EventType = 'alert' | 'deploy' | 'usage_spike';
export type EventSource = 'grafana' | 'github';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Integration {
  id: string;
  userId: string;
  type: 'grafana' | 'github';
  status: 'connected' | 'disconnected' | 'error';
  lastSyncedAt: string | null;
  config: {
    url?: string;
    org?: string;
    repo?: string;
  };
}

export interface CorrelatedCommit {
  sha: string;
  message: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  url: string;
}

export interface Event {
  id: string;
  userId: string;
  type: EventType;
  source: EventSource;
  timestamp: string;
  data: {
    title: string;
    description?: string;
    severity?: AlertSeverity;
    status?: 'firing' | 'resolved';
    version?: string;
    commitCount?: number;
    value?: number;
    previousValue?: number;
    metric?: string;
  };
  correlatedCommits?: CorrelatedCommit[];
}

export interface MetricsSummary {
  errorRate: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  latency: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeUsers: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  requestsPerMinute: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface SyncStatus {
  grafana: {
    lastSyncedAt: string;
    status: 'synced' | 'syncing' | 'error';
    eventsCount: number;
  };
  github: {
    lastSyncedAt: string;
    status: 'synced' | 'syncing' | 'error';
    eventsCount: number;
  };
}

// Generate relative timestamps
const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();
const hoursAgo = (hrs: number) => new Date(now.getTime() - hrs * 3600000).toISOString();
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString();

export const mockUser: User = {
  id: 'user-1',
  email: 'manager@company.com',
  name: 'Alex Chen',
  createdAt: daysAgo(30),
};

export const mockIntegrations: Integration[] = [
  {
    id: 'int-1',
    userId: 'user-1',
    type: 'grafana',
    status: 'connected',
    lastSyncedAt: minutesAgo(5),
    config: {
      url: 'https://grafana.company.com',
    },
  },
  {
    id: 'int-2',
    userId: 'user-1',
    type: 'github',
    status: 'connected',
    lastSyncedAt: minutesAgo(3),
    config: {
      org: 'company',
      repo: 'main-app',
    },
  },
];

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    userId: 'user-1',
    type: 'alert',
    source: 'grafana',
    timestamp: minutesAgo(15),
    data: {
      title: 'High Error Rate',
      description: 'Error rate exceeded 5% threshold for api-gateway service',
      severity: 'critical',
      status: 'firing',
      value: 7.2,
      metric: 'error_rate',
    },
    correlatedCommits: [
      {
        sha: 'a1b2c3d',
        message: 'fix: update retry logic in payment handler',
        author: 'Sarah Kim',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
        timestamp: minutesAgo(45),
        url: 'https://github.com/company/main-app/commit/a1b2c3d',
      },
      {
        sha: 'e4f5g6h',
        message: 'feat: add new payment provider integration',
        author: 'John Doe',
        authorAvatar: 'https://i.pravatar.cc/150?u=john',
        timestamp: hoursAgo(1),
        url: 'https://github.com/company/main-app/commit/e4f5g6h',
      },
    ],
  },
  {
    id: 'evt-2',
    userId: 'user-1',
    type: 'deploy',
    source: 'github',
    timestamp: hoursAgo(1),
    data: {
      title: 'v2.4.1 Released',
      description: 'Production deployment completed',
      version: 'v2.4.1',
      commitCount: 12,
    },
  },
  {
    id: 'evt-3',
    userId: 'user-1',
    type: 'alert',
    source: 'grafana',
    timestamp: hoursAgo(2),
    data: {
      title: 'Latency Spike',
      description: 'P99 latency above 500ms for user-service',
      severity: 'warning',
      status: 'resolved',
      value: 650,
      metric: 'latency_p99',
    },
    correlatedCommits: [
      {
        sha: 'i7j8k9l',
        message: 'perf: optimize database queries in user lookup',
        author: 'Mike Johnson',
        authorAvatar: 'https://i.pravatar.cc/150?u=mike',
        timestamp: hoursAgo(3),
        url: 'https://github.com/company/main-app/commit/i7j8k9l',
      },
    ],
  },
  {
    id: 'evt-4',
    userId: 'user-1',
    type: 'usage_spike',
    source: 'grafana',
    timestamp: hoursAgo(4),
    data: {
      title: 'Active Users Surge',
      description: 'Active users increased by 40% in the last hour',
      value: 12500,
      previousValue: 8900,
      metric: 'active_users',
    },
  },
  {
    id: 'evt-5',
    userId: 'user-1',
    type: 'deploy',
    source: 'github',
    timestamp: hoursAgo(8),
    data: {
      title: 'v2.4.0 Released',
      description: 'Major feature release - new dashboard',
      version: 'v2.4.0',
      commitCount: 45,
    },
  },
  {
    id: 'evt-6',
    userId: 'user-1',
    type: 'alert',
    source: 'grafana',
    timestamp: hoursAgo(12),
    data: {
      title: 'Memory Usage High',
      description: 'Memory usage above 85% on worker nodes',
      severity: 'info',
      status: 'resolved',
      value: 87,
      metric: 'memory_usage',
    },
  },
  {
    id: 'evt-7',
    userId: 'user-1',
    type: 'alert',
    source: 'grafana',
    timestamp: daysAgo(1),
    data: {
      title: 'Database Connection Pool',
      description: 'Connection pool utilization above 90%',
      severity: 'warning',
      status: 'resolved',
      value: 92,
      metric: 'db_pool_usage',
    },
    correlatedCommits: [
      {
        sha: 'm0n1o2p',
        message: 'fix: properly release database connections',
        author: 'Emma Wilson',
        authorAvatar: 'https://i.pravatar.cc/150?u=emma',
        timestamp: daysAgo(1),
        url: 'https://github.com/company/main-app/commit/m0n1o2p',
      },
    ],
  },
  {
    id: 'evt-8',
    userId: 'user-1',
    type: 'deploy',
    source: 'github',
    timestamp: daysAgo(2),
    data: {
      title: 'v2.3.5 Released',
      description: 'Hotfix for authentication bug',
      version: 'v2.3.5',
      commitCount: 3,
    },
  },
];

export const mockMetrics: MetricsSummary = {
  errorRate: {
    current: 2.3,
    previous: 1.8,
    trend: 'up',
  },
  latency: {
    current: 245,
    previous: 280,
    trend: 'down',
  },
  activeUsers: {
    current: 12847,
    previous: 11250,
    trend: 'up',
  },
  requestsPerMinute: {
    current: 4520,
    previous: 4380,
    trend: 'up',
  },
};

export const mockSyncStatus: SyncStatus = {
  grafana: {
    lastSyncedAt: minutesAgo(5),
    status: 'synced',
    eventsCount: 156,
  },
  github: {
    lastSyncedAt: minutesAgo(3),
    status: 'synced',
    eventsCount: 89,
  },
};

// Chart data for metrics trends
export const mockChartData = {
  errorRate: [
    { x: hoursAgo(24), y: 1.2 },
    { x: hoursAgo(20), y: 1.5 },
    { x: hoursAgo(16), y: 1.3 },
    { x: hoursAgo(12), y: 1.8 },
    { x: hoursAgo(8), y: 2.1 },
    { x: hoursAgo(4), y: 1.9 },
    { x: hoursAgo(0), y: 2.3 },
  ],
  latency: [
    { x: hoursAgo(24), y: 220 },
    { x: hoursAgo(20), y: 235 },
    { x: hoursAgo(16), y: 310 },
    { x: hoursAgo(12), y: 280 },
    { x: hoursAgo(8), y: 265 },
    { x: hoursAgo(4), y: 255 },
    { x: hoursAgo(0), y: 245 },
  ],
  activeUsers: [
    { x: hoursAgo(24), y: 8500 },
    { x: hoursAgo(20), y: 9200 },
    { x: hoursAgo(16), y: 10800 },
    { x: hoursAgo(12), y: 11250 },
    { x: hoursAgo(8), y: 12100 },
    { x: hoursAgo(4), y: 12500 },
    { x: hoursAgo(0), y: 12847 },
  ],
};
