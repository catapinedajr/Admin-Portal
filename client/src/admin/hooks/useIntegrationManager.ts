import { useQuery } from "@tanstack/react-query";

interface SocialIntegration {
  id: number;
  platform: string;
  displayName: string;
  accountHandle: string | null;
  isActive: boolean;
  isValidated: boolean;
  lastValidatedAt: string | null;
  lastError: string | null;
  features: string[] | null;
}

interface IntegrationStatus {
  isConnected: boolean;
  isActive: boolean;
  isValidated: boolean;
  displayName: string;
  accountHandle: string | null;
}

interface IntegrationManager {
  isLoading: boolean;
  platforms: {
    twitter: IntegrationStatus;
    linkedin: IntegrationStatus;
    instagram: IntegrationStatus;
    facebook: IntegrationStatus;
  };
  hasAnyActiveIntegration: boolean;
  canAutoPost: boolean;
  canTrackAnalytics: boolean;
  getConnectedPlatforms: () => string[];
}

const emptyStatus: IntegrationStatus = {
  isConnected: false,
  isActive: false,
  isValidated: false,
  displayName: "",
  accountHandle: null,
};

export function useIntegrationManager(): IntegrationManager {
  const { data: integrations = [], isLoading } = useQuery<SocialIntegration[]>({
    queryKey: ["/api/admin/social-integrations"],
    staleTime: 30000,
  });

  const getStatus = (platform: string): IntegrationStatus => {
    const integration = integrations.find((i) => i.platform === platform);
    if (!integration) return { ...emptyStatus };
    return {
      isConnected: true,
      isActive: integration.isActive,
      isValidated: integration.isValidated,
      displayName: integration.displayName,
      accountHandle: integration.accountHandle,
    };
  };

  const platforms = {
    twitter: getStatus("twitter"),
    linkedin: getStatus("linkedin"),
    instagram: getStatus("instagram"),
    facebook: getStatus("facebook"),
  };

  const hasAnyActiveIntegration = Object.values(platforms).some(
    (p) => p.isConnected && p.isActive && p.isValidated
  );

  const canAutoPost = hasAnyActiveIntegration;
  const canTrackAnalytics = hasAnyActiveIntegration;

  const getConnectedPlatforms = () =>
    Object.entries(platforms)
      .filter(([, status]) => status.isConnected && status.isActive && status.isValidated)
      .map(([platform]) => platform);

  return {
    isLoading,
    platforms,
    hasAnyActiveIntegration,
    canAutoPost,
    canTrackAnalytics,
    getConnectedPlatforms,
  };
}
