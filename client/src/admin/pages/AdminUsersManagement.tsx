import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  UserCog, Plus, Shield, ShieldCheck, Mail, Calendar,
  Clock, Archive, ArchiveRestore, Edit, X, Check, Eye, EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "../components/AdminLayout";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  
  const { data: adminUser, isLoading, error } = useQuery<{ id: number; role: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (error || !adminUser)) {
      setLocation('/admin/login');
    }
  }, [isLoading, error, adminUser, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!adminUser) return null;
  
  if (adminUser.role !== 'super_admin') {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Shield className="w-16 h-16 text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-zinc-400 text-center max-w-md">
            Only Super Admins can manage admin users. Contact your system administrator for access.
          </p>
        </div>
      </AdminLayout>
    );
  }
  
  return <>{children}</>;
}

interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface CreateAdminForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
}

interface EditAdminForm {
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  newPassword?: string;
}

function AdminUserCard({ 
  admin, 
  currentUserId,
  onEdit, 
  onArchive,
  onRestore 
}: { 
  admin: AdminUser; 
  currentUserId: number;
  onEdit: () => void; 
  onArchive?: () => void;
  onRestore?: () => void;
}) {
  const isCurrentUser = admin.id === currentUserId;
  
  return (
    <Card className={`bg-zinc-800/50 border-zinc-700 ${!admin.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              admin.role === 'super_admin' ? 'bg-orange-500/20' : 'bg-zinc-700'
            }`}>
              {admin.role === 'super_admin' ? (
                <ShieldCheck className="w-6 h-6 text-orange-500" />
              ) : (
                <Shield className="w-6 h-6 text-zinc-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white">
                  {admin.firstName} {admin.lastName}
                </h3>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                    You
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Mail className="w-3 h-3" />
                {admin.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={admin.role === 'super_admin' ? 'default' : 'secondary'}
              className={admin.role === 'super_admin' ? 'bg-orange-500' : ''}
              data-testid={`badge-role-${admin.id}`}
            >
              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </Badge>
            {!admin.isActive && (
              <Badge variant="destructive" data-testid={`badge-inactive-${admin.id}`}>Inactive</Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created: {new Date(admin.createdAt).toLocaleDateString()}
            </div>
            {admin.lastLoginAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last login: {new Date(admin.lastLoginAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              data-testid={`button-edit-admin-${admin.id}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {!isCurrentUser && admin.isActive && onArchive && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-orange-400 hover:text-orange-300"
                onClick={onArchive}
                data-testid={`button-archive-admin-${admin.id}`}
              >
                <Archive className="w-4 h-4" />
              </Button>
            )}
            {!isCurrentUser && !admin.isActive && onRestore && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-400 hover:text-green-300"
                onClick={onRestore}
                data-testid={`button-restore-admin-${admin.id}`}
              >
                <ArchiveRestore className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminUsersManagement() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [createForm, setCreateForm] = useState<CreateAdminForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'admin',
  });
  
  const [editForm, setEditForm] = useState<EditAdminForm>({
    firstName: '',
    lastName: '',
    role: 'admin',
    isActive: true,
    newPassword: '',
  });

  const { data: currentAdmin } = useQuery<{ id: number; role: string }>({
    queryKey: ["/api/admin/me"],
  });

  const { data: admins, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/admin-users"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateAdminForm) => {
      const res = await apiRequest('POST', '/api/admin/admin-users', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admin-users"] });
      setShowCreateDialog(false);
      setCreateForm({ email: '', password: '', firstName: '', lastName: '', role: 'admin' });
      toast({ title: "Admin Created", description: "New admin user has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create admin user.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<EditAdminForm> }) => {
      const res = await apiRequest('PATCH', `/api/admin/admin-users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admin-users"] });
      setEditingAdmin(null);
      toast({ title: "Admin Updated", description: "Admin user has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update admin user.", variant: "destructive" });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/admin/archive/admin-users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admin-users"] });
      toast({ title: "Admin Archived", description: "Admin user has been archived. They can be restored anytime." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to archive admin user.", variant: "destructive" });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/admin/restore/admin-users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/admin-users"] });
      toast({ title: "Admin Restored", description: "Admin user has been restored from archive." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to restore admin user.", variant: "destructive" });
    },
  });

  const handleEditClick = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditForm({
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role as 'admin' | 'super_admin',
      isActive: admin.isActive,
      newPassword: '',
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(createForm);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    
    const data: Partial<EditAdminForm> = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      role: editForm.role,
      isActive: editForm.isActive,
    };
    
    if (editForm.newPassword) {
      data.newPassword = editForm.newPassword;
    }
    
    updateMutation.mutate({ id: editingAdmin.id, data });
  };

  const activeAdmins = admins?.filter(a => a.isActive) || [];
  const inactiveAdmins = admins?.filter(a => !a.isActive) || [];

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserCog className="w-7 h-7 text-orange-500" />
                Admin User Management
              </h1>
              <p className="text-zinc-400 mt-1">
                Manage who has access to this admin portal
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-orange-500 hover:bg-orange-600"
              data-testid="button-create-admin"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Total Admins</p>
                    <p className="text-2xl font-bold text-white">{admins?.length || 0}</p>
                  </div>
                  <UserCog className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Super Admins</p>
                    <p className="text-2xl font-bold text-white">
                      {admins?.filter(a => a.role === 'super_admin' && a.isActive).length || 0}
                    </p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Active Admins</p>
                    <p className="text-2xl font-bold text-white">{activeAdmins.length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Active Admins ({activeAdmins.length})</h2>
                <div className="grid gap-4">
                  {activeAdmins.map(admin => (
                    <AdminUserCard
                      key={admin.id}
                      admin={admin}
                      currentUserId={currentAdmin?.id || 0}
                      onEdit={() => handleEditClick(admin)}
                      onArchive={() => archiveMutation.mutate(admin.id)}
                    />
                  ))}
                </div>
              </div>

              {inactiveAdmins.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-zinc-400 mb-3">Inactive Admins ({inactiveAdmins.length})</h2>
                  <div className="grid gap-4">
                    {inactiveAdmins.map(admin => (
                      <AdminUserCard
                        key={admin.id}
                        admin={admin}
                        currentUserId={currentAdmin?.id || 0}
                        onEdit={() => handleEditClick(admin)}
                        onRestore={() => restoreMutation.mutate(admin.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Admin</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Add a new administrator to the portal
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-zinc-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={createForm.firstName}
                      onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-zinc-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={createForm.lastName}
                      onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white pr-10"
                      minLength={8}
                      required
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500">Minimum 8 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-zinc-300">Role</Label>
                  <Select 
                    value={createForm.role} 
                    onValueChange={(value: 'admin' | 'super_admin') => setCreateForm({ ...createForm, role: value })}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-500">
                    Super Admins can manage other admin users and access all settings
                  </p>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Admin"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-white">Edit Admin User</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Update {editingAdmin?.firstName}'s account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName" className="text-zinc-300">First Name</Label>
                    <Input
                      id="editFirstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                      data-testid="input-edit-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName" className="text-zinc-300">Last Name</Label>
                    <Input
                      id="editLastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      required
                      data-testid="input-edit-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole" className="text-zinc-300">Role</Label>
                  <Select 
                    value={editForm.role} 
                    onValueChange={(value: 'admin' | 'super_admin') => setEditForm({ ...editForm, role: value })}
                    disabled={editingAdmin?.id === currentAdmin?.id}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white" data-testid="select-edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {editingAdmin?.id === currentAdmin?.id && (
                    <p className="text-xs text-zinc-500">You cannot change your own role</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-zinc-300">New Password (optional)</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Leave blank to keep current password"
                    minLength={8}
                    data-testid="input-edit-password"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-zinc-300">Account Active</Label>
                    <p className="text-xs text-zinc-500">Inactive accounts cannot log in</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={editForm.isActive}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                    disabled={editingAdmin?.id === currentAdmin?.id}
                    data-testid="switch-is-active"
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setEditingAdmin(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={updateMutation.isPending}
                    data-testid="button-submit-edit"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
