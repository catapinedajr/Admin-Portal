import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Shield, Archive, RotateCcw, Users, Building2, ShoppingCart, Target, 
  Megaphone, TrendingUp, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminLayout from "../components/AdminLayout";
import { AdminAuthGuard } from "../components/AdminAuthGuard";

interface ArchivedItem {
  id: number;
  entityType: string;
  name: string;
  archivedAt: string;
  details?: string;
}

const ARCHIVE_ENTITY_TYPES = [
  { value: 'all', label: 'All Types', icon: Archive },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'admin-users', label: 'Admin Users', icon: Shield },
  { value: 'crm-companies', label: 'Companies', icon: Building2 },
  { value: 'crm-deals', label: 'Deals', icon: Target },
  { value: 'store-products', label: 'Products', icon: ShoppingCart },
  { value: 'social-posts', label: 'Social Posts', icon: Megaphone },
  { value: 'ad-campaigns', label: 'Ad Campaigns', icon: TrendingUp },
];

export default function DataGovernance() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <ArchiveSection />
      </AdminLayout>
    </AdminAuthGuard>
  );
}

function ArchiveSection() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ entityType: string; id: number; name: string } | null>(null);

  const { data: archivedItems = [], isLoading, refetch } = useQuery<ArchivedItem[]>({
    queryKey: ["/api/admin/archive", selectedType],
    queryFn: async () => {
      const url = selectedType === 'all' 
        ? '/api/admin/archive' 
        : `/api/admin/archive?type=${selectedType}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch archived items');
      return response.json();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async ({ entityType, id }: { entityType: string; id: number }) => {
      return apiRequest('POST', `/api/admin/archive/${entityType}/${id}/restore`);
    },
    onSuccess: () => {
      toast({ title: "Item restored", description: "The item has been restored successfully." });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error restoring item", 
        description: error.message || "Failed to restore item",
        variant: "destructive"
      });
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async ({ entityType, id }: { entityType: string; id: number }) => {
      return apiRequest('DELETE', `/api/admin/archive/${entityType}/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Item deleted", description: "The item has been permanently deleted." });
      refetch();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting item", 
        description: error.message || "Failed to delete item",
        variant: "destructive"
      });
    },
  });

  const getEntityIcon = (entityType: string) => {
    const type = ARCHIVE_ENTITY_TYPES.find(t => t.value === entityType);
    return type?.icon || Archive;
  };

  const getEntityLabel = (entityType: string) => {
    const type = ARCHIVE_ENTITY_TYPES.find(t => t.value === entityType);
    return type?.label || entityType;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Governance</h1>
          <p className="text-zinc-400">Manage archived items, data retention, and recovery</p>
        </div>
      </div>

      <Card className="bg-zinc-800/30 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-orange-500" />
            Archived Items
          </CardTitle>
          <CardDescription className="text-zinc-400">
            View and manage archived items. Restore or permanently delete items from the archive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ARCHIVE_ENTITY_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={selectedType === type.value 
                    ? "bg-orange-500 hover:bg-orange-600" 
                    : "border-zinc-600 hover:border-orange-500"
                  }
                  data-testid={`filter-archive-${type.value}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : archivedItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No archived items</p>
              <p className="text-sm mt-1">
                {selectedType === 'all' 
                  ? "Items you archive will appear here for review or restoration."
                  : `No archived ${getEntityLabel(selectedType).toLowerCase()} found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedItems.map((item) => {
                const Icon = getEntityIcon(item.entityType);
                return (
                  <div
                    key={`${item.entityType}-${item.id}`}
                    className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg"
                    data-testid={`archived-item-${item.entityType}-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <Icon className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <span>{getEntityLabel(item.entityType)}</span>
                          <span>•</span>
                          <span>Archived {new Date(item.archivedAt).toLocaleDateString()}</span>
                        </div>
                        {item.details && (
                          <p className="text-xs text-zinc-600 mt-1">{item.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreMutation.mutate({ entityType: item.entityType, id: item.id })}
                        disabled={restoreMutation.isPending}
                        className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                        data-testid={`button-restore-${item.entityType}-${item.id}`}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setItemToDelete({ entityType: item.entityType, id: item.id, name: item.name });
                          setDeleteDialogOpen(true);
                        }}
                        disabled={permanentDeleteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        data-testid={`button-delete-${item.entityType}-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              <strong className="text-zinc-400">Note:</strong> Archived items are hidden from regular views but remain in the database. 
              Use "Restore" to bring items back or "Delete" to permanently remove them.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Permanently Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to permanently delete <strong className="text-white">{itemToDelete?.name}</strong>? 
              This action cannot be undone and the data will be lost forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  permanentDeleteMutation.mutate({ 
                    entityType: itemToDelete.entityType, 
                    id: itemToDelete.id 
                  });
                }
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
