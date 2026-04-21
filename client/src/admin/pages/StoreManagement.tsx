import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, Link2, Building2, Package, ShoppingCart, 
  Trash2, ExternalLink, DollarSign, MousePointerClick,
  TrendingUp, Users, CheckCircle, Clock, XCircle,
  Edit2, ChevronRight, AlertTriangle, Banknote, Archive, ArchiveRestore
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "../components/AdminLayout";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const [, setLocation] = useLocation();
    
    const { data: adminUser, isLoading, error } = useQuery<{ id: number }>({
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
    return <>{children}</>;
}

interface AffiliateProduct {
    id: number;
    name: string;
    description: string | null;
    category: string;
    affiliateUrl: string;
    imageUrl: string | null;
    vendor: string | null;
    commissionPercent: string | null;
    commissionFlat: string | null;
    priceUsd: string | null;
    isActive: boolean;
    sortOrder: number;
}

interface AffiliateStats {
    productId: number;
    clicks: number;
    conversions: number;
    revenue: number;
}

interface ReferralPartner {
    id: number;
    name: string;
    category: string;
    description: string | null;
    referralUrl: string;
    logoUrl: string | null;
    contactName: string | null;
    contactEmail: string | null;
    referralFeeType: string;
    referralFeeAmount: string | null;
    referralFeePercent: string | null;
    payoutFrequency: string | null;
    isActive: boolean;
    notes: string | null;
}

interface ReferralSignup {
    id: number;
    partnerId: number;
    userId: number | null;
    referralCode: string | null;
    status: string;
    signupDate: string;
    verifiedAt: string | null;
    estimatedValue: string | null;
    actualPayout: string | null;
    paidAt: string | null;
}

interface InventoryProduct {
    id: number;
    name: string;
    description: string | null;
    priceUsd: string;
    priceSats: number | null;
    imageUrl: string | null;
    category: string | null;
    stockQuantity: number;
    isActive: boolean;
    isFeatured: boolean;
}

interface StoreOrder {
    id: number;
    userId: number | null;
    status: string;
    totalUsd: string;
    shippingAddress: any;
    trackingNumber: string | null;
    createdAt: string;
}

const AFFILIATE_CATEGORIES = [
    { value: "hardware_wallet", label: "Hardware Wallet" },
    { value: "book", label: "Book" },
    { value: "course", label: "Course" },
    { value: "software", label: "Software" },
    { value: "other", label: "Other" },
];

const REFERRAL_CATEGORIES = [
    { value: "exchange", label: "Exchange" },
    { value: "btc_ira", label: "BTC IRA" },
    { value: "lending", label: "Lending" },
    { value: "custody", label: "Custody" },
    { value: "other", label: "Other" },
];

const INVENTORY_CATEGORIES = [
    { value: "apparel", label: "Apparel" },
    { value: "accessories", label: "Accessories" },
    { value: "stickers", label: "Stickers" },
    { value: "other", label: "Other" },
];

function AffiliateProductCard({ 
    product, 
    stats,
    onEdit 
}: { 
    product: AffiliateProduct; 
    stats?: AffiliateStats;
    onEdit: () => void;
}) {
  return (
        <Card 
            className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 cursor-pointer transition-all"
            onClick={onEdit}
            data-testid={`card-affiliate-${product.id}`}
        >
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-orange-500" />
                </div>
                )}
                <div>
                <h3 className="font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-zinc-400">{product.vendor || 'No vendor'}</p>
                </div>
            </div>
            <Badge className={
                product.isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
            }>
                {product.isActive ? 'Active' : 'Inactive'}
            </Badge>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-zinc-900/50 rounded p-2 text-center">
                <p className="text-xs text-zinc-500">Clicks</p>
                <p className="text-lg font-semibold text-white">{stats?.clicks || 0}</p>
            </div>
            <div className="bg-zinc-900/50 rounded p-2 text-center">
                <p className="text-xs text-zinc-500">Conversions</p>
                <p className="text-lg font-semibold text-green-400">{stats?.conversions || 0}</p>
            </div>
            <div className="bg-zinc-900/50 rounded p-2 text-center">
                <p className="text-xs text-zinc-500">Revenue</p>
                <p className="text-lg font-semibold text-orange-400">${(stats?.revenue || 0).toFixed(2)}</p>
            </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500 capitalize">{product.category.replace('_', ' ')}</span>
            {product.commissionPercent && (
                <span className="text-orange-400">{product.commissionPercent}% commission</span>
            )}
            </div>
        </CardContent>
        </Card>
    );
}

function NewAffiliateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "hardware_wallet",
        affiliateUrl: "",
        imageUrl: "",
        vendor: "",
        commissionPercent: "",
        priceUsd: "",
    });

    const createMutation = useMutation({
        mutationFn: async () => {
        const res = await apiRequest("POST", "/api/admin/store/affiliates", {
            ...formData,
            commissionPercent: formData.commissionPercent ? parseFloat(formData.commissionPercent) : null,
            priceUsd: formData.priceUsd ? parseFloat(formData.priceUsd) : null,
        });
        return res.json();
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/store/affiliates"] });
        toast({ title: "Affiliate product created successfully" });
        onOpenChange(false);
        setFormData({ name: "", description: "", category: "hardware_wallet", affiliateUrl: "", imageUrl: "", vendor: "", commissionPercent: "", priceUsd: "" });
        },
        onError: (error: Error) => {
        toast({ title: "Failed to create affiliate product", description: error.message, variant: "destructive" });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
            <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-orange-500" />
                Add Affiliate Product
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
                Add a new affiliate product to earn commissions
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
                <Label className="text-zinc-300">Product Name *</Label>
                <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Ledger Nano X"
                data-testid="input-affiliate-name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    {AFFILIATE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Affiliate URL *</Label>
                <Input
                value={formData.affiliateUrl}
                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://affiliate.example.com/ref=hodlearn"
                data-testid="input-affiliate-url"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Vendor</Label>
                <Input
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Ledger"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label className="text-zinc-300">Price (USD)</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="149.00"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-zinc-300">Commission %</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.commissionPercent}
                    onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="10"
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Image URL</Label>
                <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://example.com/product.jpg"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Product description..."
                rows={3}
                />
            </div>
            <Button
                onClick={() => createMutation.mutate()}
                disabled={!formData.name || !formData.affiliateUrl || createMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600"
                data-testid="button-create-affiliate"
            >
                {createMutation.isPending ? "Creating..." : "Create Affiliate Product"}
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    );
}

function EditAffiliateDialog({ affiliate, open, onOpenChange }: { affiliate: AffiliateProduct | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "hardware_wallet",
        affiliateUrl: "",
        imageUrl: "",
        vendor: "",
        commissionPercent: "",
        priceUsd: "",
        isActive: true,
    });

    useEffect(() => {
        if (affiliate) {
            setFormData({
                name: affiliate.name,
                description: affiliate.description || "",
                category: affiliate.category,
                affiliateUrl: affiliate.affiliateUrl,
                imageUrl: affiliate.imageUrl || "",
                vendor: affiliate.vendor || "",
                commissionPercent: affiliate.commissionPercent || "",
                priceUsd: affiliate.priceUsd || "",
                isActive: affiliate.isActive ?? false,
            });
        }
    }, [affiliate]);

    const updateMutation = useMutation({
        mutationFn: async () => {
        const res = await apiRequest("PATCH", `/api/admin/store/affiliates/${affiliate?.id}`, {
            ...formData,
            commissionPercent: formData.commissionPercent ? parseFloat(formData.commissionPercent) : null,
            priceUsd: formData.priceUsd ? parseFloat(formData.priceUsd) : null,
        });
        return res.json();
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/store/affiliates"] });
        toast({ title: "Affiliate product updated" });
        onOpenChange(false);
        },
        onError: (error: Error) => {
        toast({ title: "Failed to update", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
        const res = await apiRequest("DELETE", `/api/admin/store/affiliates/${affiliate?.id}`);
        return res.json();
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/store/affiliates"] });
        toast({ title: "Affiliate product deleted" });
        onOpenChange(false);
        },
        onError: (error: Error) => {
        toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
        },
    });

    if (!affiliate) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
            <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-orange-500" />
                Edit Affiliate Product
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
                Update affiliate product details
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
                <Label className="text-zinc-300">Product Name *</Label>
                <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-edit-affiliate-name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    {AFFILIATE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Affiliate URL *</Label>
                <Input
                value={formData.affiliateUrl}
                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-edit-affiliate-url"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Vendor</Label>
                <Input
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label className="text-zinc-300">Price (USD)</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.priceUsd}
                    onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-zinc-300">Commission %</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.commissionPercent}
                    onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Image URL</Label>
                <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                rows={3}
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-zinc-600 bg-zinc-800"
                id="affiliate-active"
                />
                <Label htmlFor="affiliate-active" className="text-zinc-300">Active</Label>
            </div>
            <div className="flex gap-2">
                <Button
                onClick={() => updateMutation.mutate()}
                disabled={!formData.name || !formData.affiliateUrl || updateMutation.isPending}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                data-testid="button-update-affiliate"
                >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteMutation.isPending}
                data-testid="button-delete-affiliate"
                >
                <Trash2 className="w-4 h-4" />
                </Button>
            </div>
            </div>
        </DialogContent>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Affiliate Product</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                Are you sure you want to delete "{affiliate?.name}"? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => { deleteMutation.mutate(); setShowDeleteConfirm(false); }}
                >
                Delete
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </Dialog>
    );
}

function ReferralPartnerCard({ partner, signupCount, onEdit }: { partner: ReferralPartner; signupCount: number; onEdit: () => void }) {
    return (
        <Card 
        className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 cursor-pointer transition-all"
        onClick={onEdit}
        data-testid={`card-partner-${partner.id}`}
        >
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                )}
                <div>
                <h3 className="font-semibold text-white">{partner.name}</h3>
                <p className="text-sm text-zinc-400 capitalize">{partner.category?.replace('_', ' ')}</p>
                </div>
            </div>
            <Badge className={
                partner.isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
            }>
                {partner.isActive ? 'Active' : 'Inactive'}
            </Badge>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
                <span className="text-white">{signupCount} signups</span>
            </div>
            <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-500" />
                <span className="text-orange-400">
                {partner.referralFeeType === 'percent' 
                    ? `${partner.referralFeePercent}%` 
                    : `$${partner.referralFeeAmount || '0'}`}
                </span>
            </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">{partner.payoutFrequency} payout</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
            </div>
        </CardContent>
        </Card>
    );
}

function NewReferralPartnerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        category: "exchange",
        description: "",
        referralUrl: "",
        logoUrl: "",
        contactName: "",
        contactEmail: "",
        referralFeeType: "flat",
        referralFeeAmount: "",
        referralFeePercent: "",
        payoutFrequency: "monthly",
        notes: "",
    });

    const createMutation = useMutation({
        mutationFn: async () => {
        const res = await apiRequest("POST", "/api/admin/store/referrals", {
            ...formData,
            referralFeeAmount: formData.referralFeeAmount ? parseFloat(formData.referralFeeAmount) : null,
            referralFeePercent: formData.referralFeePercent ? parseFloat(formData.referralFeePercent) : null,
        });
        return res.json();
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/store/referrals"] });
        toast({ title: "Referral partner created successfully" });
        onOpenChange(false);
        setFormData({ name: "", category: "exchange", description: "", referralUrl: "", logoUrl: "", contactName: "", contactEmail: "", referralFeeType: "flat", referralFeeAmount: "", referralFeePercent: "", payoutFrequency: "monthly", notes: "" });
        },
        onError: (error: Error) => {
        toast({ title: "Failed to create referral partner", description: error.message, variant: "destructive" });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
            <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Add Referral Partner
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
                Add a new partner company for user referrals
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
                <Label className="text-zinc-300">Partner Name *</Label>
                <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Swan Bitcoin"
                data-testid="input-partner-name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    {REFERRAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Referral URL *</Label>
                <Input
                value={formData.referralUrl}
                onChange={(e) => setFormData({ ...formData, referralUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://partner.com/ref/hodlearn"
                data-testid="input-referral-url"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label className="text-zinc-300">Contact Name</Label>
                <Input
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="John Doe"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-zinc-300">Contact Email</Label>
                <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="john@partner.com"
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Fee Type</Label>
                <Select value={formData.referralFeeType} onValueChange={(v) => setFormData({ ...formData, referralFeeType: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="flat" className="text-white">Flat Fee</SelectItem>
                    <SelectItem value="percent" className="text-white">Percentage</SelectItem>
                    <SelectItem value="tiered" className="text-white">Tiered</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label className="text-zinc-300">Fee Amount ($)</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.referralFeeAmount}
                    onChange={(e) => setFormData({ ...formData, referralFeeAmount: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="50.00"
                />
                </div>
                <div className="space-y-2">
                <Label className="text-zinc-300">Fee Percent (%)</Label>
                <Input
                    type="number"
                    step="0.01"
                    value={formData.referralFeePercent}
                    onChange={(e) => setFormData({ ...formData, referralFeePercent: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="5"
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Payout Frequency</Label>
                <Select value={formData.payoutFrequency} onValueChange={(v) => setFormData({ ...formData, payoutFrequency: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                    <SelectItem value="quarterly" className="text-white">Quarterly</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Partner description..."
                rows={2}
                />
            </div>
            <Button
                onClick={() => createMutation.mutate()}
                disabled={!formData.name || !formData.referralUrl || createMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600"
                data-testid="button-create-partner"
            >
                {createMutation.isPending ? "Creating..." : "Create Referral Partner"}
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    );
}

function EditReferralPartnerDialog({ partner, open, onOpenChange }: { partner: ReferralPartner | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "exchange",
        description: "",
        referralUrl: "",
        logoUrl: "",
        contactName: "",
        contactEmail: "",
        referralFeeType: "flat",
        referralFeeAmount: "",
        referralFeePercent: "",
        payoutFrequency: "monthly",
        notes: "",
        isActive: true,
    });

    useEffect(() => {
        if (partner) {
        setFormData({
            name: partner.name,
            category: partner.category,
            description: partner.description || "",
            referralUrl: partner.referralUrl,
            logoUrl: partner.logoUrl || "",
            contactName: partner.contactName || "",
            contactEmail: partner.contactEmail || "",
            referralFeeType: partner.referralFeeType,
            referralFeeAmount: partner.referralFeeAmount || "",
            referralFeePercent: partner.referralFeePercent || "",
            payoutFrequency: partner.payoutFrequency || "monthly",
            notes: partner.notes || "",
            isActive: partner.isActive,
        });
        }
    }, [partner]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            console.log('Updating partner with data:', formData);
            const res = await apiRequest("PATCH", `/api/admin/store/referrals/${partner?.id}`, {
                ...formData,
                referralFeeAmount: formData.referralFeeAmount ? parseFloat(formData.referralFeeAmount) : null,
                referralFeePercent: formData.referralFeePercent ? parseFloat(formData.referralFeePercent) : null,
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/store/referrals"] });
            toast({ title: "Partner updated" });
            onOpenChange(false);
        },
        onError: (error: Error) => {
            toast({ title: "Failed to update", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("DELETE", `/api/admin/store/referrals/${partner?.id}`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/store/referrals"] });
            toast({ title: "Partner deleted" });
            onOpenChange(false);
        },
        onError: (error: Error) => {
            toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
        },
    });

    if (!partner) return null;

    console.log('formData', formData);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
            <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Edit Referral Partner
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
                Update partner details
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
                <Label className="text-zinc-300">Partner Name *</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-edit-partner-name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    {REFERRAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Referral URL *</Label>
                <Input
                    value={formData.referralUrl ?? null}
                    onChange={(e) => setFormData({ ...formData, referralUrl: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    data-testid="input-edit-referral-url"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-zinc-300">Contact Name</Label>
                    <Input
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label className="text-zinc-300">Contact Email</Label>
                    <Input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Fee Type</Label>
                <Select value={formData.referralFeeType} onValueChange={(v) => setFormData({ ...formData, referralFeeType: v })}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="flat" className="text-white">Flat Fee</SelectItem>
                        <SelectItem value="percent" className="text-white">Percentage</SelectItem>
                        <SelectItem value="tiered" className="text-white">Tiered</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-zinc-300">Fee Amount ($)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.referralFeeAmount}
                        onChange={(e) => setFormData({ ...formData, referralFeeAmount: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-zinc-300">Fee Percent (%)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.referralFeePercent}
                        onChange={(e) => setFormData({ ...formData, referralFeePercent: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-zinc-300">Payout Frequency</Label>
                <Select value={formData.payoutFrequency} onValueChange={(v) => setFormData({ ...formData, payoutFrequency: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                    <SelectItem value="quarterly" className="text-white">Quarterly</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-zinc-600 bg-zinc-800"
                    id="partner-active"
                />
                <Label htmlFor="partner-active" className="text-zinc-300">Active</Label>
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={() => updateMutation.mutate()}
                    disabled={!formData.name || !formData.referralUrl || updateMutation.isPending}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    data-testid="button-update-partner"
                >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete-partner"
                >
                <Trash2 className="w-4 h-4" />
                </Button>
            </div>
            </div>
        </DialogContent>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Referral Partner</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                Are you sure you want to delete "{partner?.name}"? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => { deleteMutation.mutate(); setShowDeleteConfirm(false); }}
                >
                Delete
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </Dialog>
    );
}

function InventoryProductCard({ product, onEdit }: { product: InventoryProduct; onEdit: () => void }) {
  const stockStatus = product.stockQuantity <= 0 ? 'out' : product.stockQuantity <= 5 ? 'low' : 'good';
  
  return (
    <Card 
      className="bg-zinc-800/50 border-zinc-700 hover:border-orange-500/50 cursor-pointer transition-all"
      onClick={onEdit}
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-zinc-400">${parseFloat(product.priceUsd).toFixed(2)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={
              product.isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-zinc-600/20 text-zinc-400 border-zinc-500/30'
            }>
              {product.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {product.isFeatured && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Featured
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-zinc-500" />
            <span className={
              stockStatus === 'out' ? 'text-red-400' :
              stockStatus === 'low' ? 'text-yellow-400' :
              'text-green-400'
            }>
              {product.stockQuantity} in stock
            </span>
          </div>
          <span className="text-zinc-500 capitalize">{product.category || 'Uncategorized'}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function NewInventoryProductDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceUsd: "",
    priceSats: "",
    imageUrl: "",
    category: "apparel",
    stockQuantity: "0",
    isFeatured: false,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/store/inventory", {
        ...formData,
        priceUsd: parseFloat(formData.priceUsd),
        priceSats: formData.priceSats ? parseInt(formData.priceSats) : null,
        stockQuantity: parseInt(formData.stockQuantity),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store/inventory"] });
      toast({ title: "Product created successfully" });
      onOpenChange(false);
      setFormData({ name: "", description: "", priceUsd: "", priceSats: "", imageUrl: "", category: "apparel", stockQuantity: "0", isFeatured: false });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create product", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Add Inventory Product
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a new product to your merchandise inventory
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-zinc-300">Product Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="HODL T-Shirt"
              data-testid="input-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {INVENTORY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (USD) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.priceUsd}
                onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="29.99"
                data-testid="input-product-price"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (Sats)</Label>
              <Input
                type="number"
                value={formData.priceSats}
                onChange={(e) => setFormData({ ...formData, priceSats: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="30000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Initial Stock Quantity</Label>
            <Input
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://example.com/product.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Product description..."
              rows={3}
            />
          </div>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!formData.name || !formData.priceUsd || createMutation.isPending}
            className="w-full bg-purple-500 hover:bg-purple-600"
            data-testid="button-create-product"
          >
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditInventoryProductDialog({ product, open, onOpenChange }: { product: InventoryProduct | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceUsd: "",
    priceSats: "",
    imageUrl: "",
    category: "apparel",
    stockQuantity: "0",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        priceUsd: product.priceUsd,
        priceSats: product.priceSats?.toString() || "",
        imageUrl: product.imageUrl || "",
        category: product.category || "apparel",
        stockQuantity: product.stockQuantity.toString(),
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/admin/store/inventory/${product?.id}`, {
        ...formData,
        priceUsd: parseFloat(formData.priceUsd),
        priceSats: formData.priceSats ? parseInt(formData.priceSats) : null,
        stockQuantity: parseInt(formData.stockQuantity),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store/inventory"] });
      toast({ title: "Product updated" });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/archive/store-products/${product?.id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store/inventory"] });
      toast({ title: "Product archived", description: "It can be restored from the archive anytime." });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to archive", description: error.message, variant: "destructive" });
    },
  });

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Update product details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-zinc-300">Product Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              data-testid="input-edit-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {INVENTORY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white">{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (USD) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.priceUsd}
                onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (Sats)</Label>
              <Input
                type="number"
                value={formData.priceSats}
                onChange={(e) => setFormData({ ...formData, priceSats: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Stock Quantity</Label>
            <Input
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Image URL</Label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-zinc-600 bg-zinc-800"
                id="product-active"
              />
              <Label htmlFor="product-active" className="text-zinc-300">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-zinc-600 bg-zinc-800"
                id="product-featured"
              />
              <Label htmlFor="product-featured" className="text-zinc-300">Featured</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={!formData.name || !formData.priceUsd || updateMutation.isPending}
              className="flex-1 bg-purple-500 hover:bg-purple-600"
              data-testid="button-update-product"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={archiveMutation.isPending}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
              data-testid="button-archive-product"
            >
              <Archive className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Archive Product</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to archive "{product?.name}"? Archived items can be restored anytime from the archive view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => { archiveMutation.mutate(); setShowDeleteConfirm(false); }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

function OrderCard({ order }: { order: StoreOrder }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const StatusIcon = order.status === 'delivered' ? CheckCircle :
                     order.status === 'cancelled' ? XCircle :
                     order.status === 'shipped' ? Package :
                     Clock;

  return (
    <Card className="bg-zinc-800/50 border-zinc-700" data-testid={`card-order-${order.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Order #{order.id}</h3>
              <p className="text-sm text-zinc-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge className={statusColors[order.status] || statusColors.pending}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {order.status}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-zinc-500">Total</span>
          <span className="text-white font-semibold">${parseFloat(order.totalUsd).toFixed(2)}</span>
        </div>
        {order.trackingNumber && (
          <div className="mt-2 text-sm text-zinc-400">
            Tracking: {order.trackingNumber}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AffiliatesTab() {
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [editingAffiliate, setEditingAffiliate] = useState<AffiliateProduct | null>(null);
    
    const { data: affiliates, isLoading } = useQuery<AffiliateProduct[]>({
        queryKey: ["/api/admin/store/affiliates"],
    });

    const { data: stats } = useQuery<AffiliateStats[]>({
        queryKey: ["/api/admin/store/affiliates/stats"],
    });

    const totalClicks = stats?.reduce((sum, s) => sum + s.clicks, 0) || 0;
    const totalConversions = stats?.reduce((sum, s) => sum + s.conversions, 0) || 0;
    const totalRevenue = stats?.reduce((sum, s) => sum + s.revenue, 0) || 0;
    
    // Calculate estimated commissions per product
    const commissionsData = affiliates?.map(product => {
        const productStats = stats?.find(s => s.productId === product.id);
        const commissionPercent = parseFloat(product.commissionPercent || '0');
        const commission = (productStats?.revenue || 0) * (commissionPercent / 100);
        return { product, stats: productStats, commission };
    }).filter(c => c.commission > 0) || [];
    
    const totalCommissions = commissionsData.reduce((sum, c) => sum + c.commission, 0);

    return (
        <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Products</p>
                    <p className="text-2xl font-bold text-white">{affiliates?.length || 0}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <MousePointerClick className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Total Clicks</p>
                    <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Conversions</p>
                    <p className="text-2xl font-bold text-white">{totalConversions.toLocaleString()}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Revenue</p>
                    <p className="text-2xl font-bold text-orange-400">${totalRevenue.toFixed(2)}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Commissions Earned</p>
                    <p className="text-2xl font-bold text-emerald-400">${totalCommissions.toFixed(2)}</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Commission Breakdown */}
        {commissionsData.length > 0 && (
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="pb-3">
                <CardTitle className="text-white text-base flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-500" />
                Commission Payouts Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                {commissionsData.slice(0, 5).map(({ product, stats, commission }) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg" data-testid={`commission-${product.id}`}>
                    <div>
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-zinc-500">{product.commissionPercent}% commission on ${stats?.revenue.toFixed(2) || '0.00'}</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white">${commission.toFixed(2)}</Badge>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        )}

        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Affiliate Products</h3>
            <Button onClick={() => setShowNewDialog(true)} className="bg-orange-500 hover:bg-orange-600" data-testid="button-add-affiliate">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
            </Button>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        ) : affiliates?.length === 0 ? (
            <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="p-8 text-center">
                <Link2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No affiliate products yet</h3>
                <p className="text-zinc-400 mb-4">Add your first affiliate product to start earning commissions</p>
                <Button onClick={() => setShowNewDialog(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
                </Button>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {affiliates?.map((product) => (
                <AffiliateProductCard
                key={product.id}
                product={product}
                stats={stats?.find(s => s.productId === product.id)}
                onEdit={() => setEditingAffiliate(product)}
                />
            ))}
            </div>
        )}

        <NewAffiliateDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
        <EditAffiliateDialog 
            affiliate={editingAffiliate} 
            open={!!editingAffiliate} 
            onOpenChange={(open) => !open && setEditingAffiliate(null)} 
        />
        </div>
    );
}

function ReferralsTab() {
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [editingPartner, setEditingPartner] = useState<ReferralPartner | null>(null);
    
    const { data: partners, isLoading } = useQuery<ReferralPartner[]>({
        queryKey: ["/api/admin/store/referrals"],
    });

    const { data: signups } = useQuery<ReferralSignup[]>({
        queryKey: ["/api/admin/store/referrals/signups"],
    });

    const signupsByPartner = signups?.reduce((acc, s) => {
        acc[s.partnerId] = (acc[s.partnerId] || 0) + 1;
        return acc;
    }, {} as Record<number, number>) || {};

    const totalSignups = signups?.length || 0;
    const verifiedSignups = signups?.filter(s => s.status === 'verified' || s.status === 'paid').length || 0;
    const pendingPayouts = signups?.filter(s => s.status === 'verified').reduce((sum, s) => sum + parseFloat(s.estimatedValue || '0'), 0) || 0;

    return (
        <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Partners</p>
                    <p className="text-2xl font-bold text-white">{partners?.length || 0}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Total Signups</p>
                    <p className="text-2xl font-bold text-white">{totalSignups}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Verified</p>
                    <p className="text-2xl font-bold text-green-400">{verifiedSignups}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Pending Payouts</p>
                    <p className="text-2xl font-bold text-orange-400">${pendingPayouts.toFixed(2)}</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Referral Partners</h3>
            <Button onClick={() => setShowNewDialog(true)} className="bg-blue-500 hover:bg-blue-600" data-testid="button-add-partner">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
            </Button>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        ) : partners?.length === 0 ? (
            <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No referral partners yet</h3>
                <p className="text-zinc-400 mb-4">Add your first partner to start tracking referrals</p>
                <Button onClick={() => setShowNewDialog(true)} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add First Partner
                </Button>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners?.map((partner) => (
                <ReferralPartnerCard
                    key={partner.id}
                    partner={partner}
                    signupCount={signupsByPartner[partner.id] || 0}
                    onEdit={() => setEditingPartner(partner)}
                />
            ))}
            </div>
        )}

        <NewReferralPartnerDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
        <EditReferralPartnerDialog 
            partner={editingPartner} 
            open={!!editingPartner} 
            onOpenChange={(open) => !open && setEditingPartner(null)} 
        />
        </div>
    );
}

function InventoryTab() {
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    
    const { data: products, isLoading } = useQuery<InventoryProduct[]>({
        queryKey: ["/api/admin/store/inventory"],
    });

    const { data: orders } = useQuery<StoreOrder[]>({
        queryKey: ["/api/admin/store/orders"],
    });

    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter(p => p.isActive).length || 0;
    const lowStockProducts = products?.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length || 0;
    const outOfStockProducts = products?.filter(p => p.stockQuantity <= 0).length || 0;
    const lowStockItems = products?.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5) || [];
    const outOfStockItems = products?.filter(p => p.stockQuantity <= 0) || [];

    // Calculate revenue from orders
    const totalRevenue = orders?.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
        .reduce((sum, o) => sum + parseFloat(o.totalUsd || '0'), 0) || 0;
    const pendingRevenue = orders?.filter(o => o.status === 'pending')
        .reduce((sum, o) => sum + parseFloat(o.totalUsd || '0'), 0) || 0;
    const todayOrders = orders?.filter(o => {
        const orderDate = new Date(o.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    }).length || 0;

    const filteredOrders = statusFilter === "all" 
        ? orders 
        : orders?.filter(o => o.status === statusFilter);

    return (
        <div className="space-y-6">
        {/* Low Stock Alerts */}
        {(lowStockProducts > 0 || outOfStockProducts > 0) && (
            <Card className="bg-red-950/30 border-red-800">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-semibold text-red-400 mb-2">Stock Alerts</h3>
                    <div className="space-y-2">
                    {outOfStockItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-red-900/30 rounded-lg" data-testid={`alert-oos-${item.id}`}>
                        <span className="text-white">{item.name}</span>
                        <Badge className="bg-red-600 text-white">Out of Stock</Badge>
                        </div>
                    ))}
                    {lowStockItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-yellow-900/30 rounded-lg" data-testid={`alert-low-${item.id}`}>
                        <span className="text-white">{item.name}</span>
                        <Badge className="bg-yellow-600 text-white">Only {item.stockQuantity} left</Badge>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        )}

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">${totalRevenue.toFixed(2)}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Pending Revenue</p>
                    <p className="text-2xl font-bold text-yellow-400">${pendingRevenue.toFixed(2)}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Today's Orders</p>
                    <p className="text-2xl font-bold text-blue-400">{todayOrders}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{orders?.length || 0}</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        {/* Product Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Products</p>
                    <p className="text-2xl font-bold text-white">{totalProducts}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Active</p>
                    <p className="text-2xl font-bold text-green-400">{activeProducts}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-400">{lowStockProducts}</p>
                </div>
                </div>
            </CardContent>
            </Card>
            <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <p className="text-sm text-zinc-400">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-400">{outOfStockProducts}</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>

        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Products</h3>
            <Button onClick={() => setShowNewDialog(true)} className="bg-purple-500 hover:bg-purple-600" data-testid="button-add-product">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
            </Button>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        ) : products?.length === 0 ? (
            <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
            <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
                <p className="text-zinc-400 mb-4">Add your first merchandise product to start selling</p>
                <Button onClick={() => setShowNewDialog(true)} className="bg-purple-500 hover:bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add First Product
                </Button>
            </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map((product) => (
                <InventoryProductCard
                key={product.id}
                product={product}
                onEdit={() => setEditingProduct(product)}
                />
            ))}
            </div>
        )}

        <EditInventoryProductDialog 
            product={editingProduct} 
            open={!!editingProduct} 
            onOpenChange={(open) => !open && setEditingProduct(null)} 
        />

        <div className="pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-white">All Orders</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="paid" className="text-white">Paid</SelectItem>
                <SelectItem value="shipped" className="text-white">Shipped</SelectItem>
                <SelectItem value="delivered" className="text-white">Delivered</SelectItem>
                <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {!orders || orders.length === 0 ? (
            <Card className="bg-zinc-800/30 border-zinc-700 border-dashed">
                <CardContent className="p-6 text-center">
                <ShoppingCart className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400">No orders yet</p>
                </CardContent>
            </Card>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders?.slice(0, 6).map((order) => (
                <OrderCard key={order.id} order={order} />
                ))}
            </div>
            )}
        </div>

        <NewInventoryProductDialog open={showNewDialog} onOpenChange={setShowNewDialog} />
        </div>
    );
}

function StoreManagementContent() {
    return (
        <AdminLayout>
        <div className="p-6">
            <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Store Management</h1>
            <p className="text-zinc-400">Manage affiliate products, referral partners, and merchandise inventory</p>
            </div>

            <Tabs defaultValue="affiliates" className="space-y-6">
            <TabsList className="bg-zinc-800/50 border border-zinc-700 p-1">
                <TabsTrigger 
                value="affiliates" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                data-testid="tab-affiliates"
                >
                <Link2 className="w-4 h-4 mr-2" />
                Affiliates
                </TabsTrigger>
                <TabsTrigger 
                value="referrals" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                data-testid="tab-referrals"
                >
                <Building2 className="w-4 h-4 mr-2" />
                Referrals
                </TabsTrigger>
                <TabsTrigger 
                value="inventory" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                data-testid="tab-inventory"
                >
                <Package className="w-4 h-4 mr-2" />
                Inventory
                </TabsTrigger>
            </TabsList>

            <TabsContent value="affiliates">
                <AffiliatesTab />
            </TabsContent>

            <TabsContent value="referrals">
                <ReferralsTab />
            </TabsContent>

            <TabsContent value="inventory">
                <InventoryTab />
            </TabsContent>
            </Tabs>
        </div>
        </AdminLayout>
    );
}

export default function StoreManagement() {
    return (
        <AdminAuthGuard>
        <StoreManagementContent />
        </AdminAuthGuard>
    );
}
