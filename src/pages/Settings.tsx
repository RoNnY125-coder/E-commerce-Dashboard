import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Bell, Shield, CreditCard, Store, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "@/api/organization.api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Settings = () => {
  const user = useAuthStore(state => state.user);
  
  const { data: orgData } = useQuery({
    queryKey: ['organization'],
    queryFn: () => organizationApi.getOrgInfo()
  });

  const org = orgData?.data;

  // Split name for simple form usage
  const [firstName, ...lastNames] = (user?.name || "").split(" ");
  const lastName = lastNames.join(" ");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and store preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="store" className="gap-2">
              <Store className="w-4 h-4" />
              Store
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 card-shadow space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal details and profile picture
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'admin'}`} />
                  <AvatarFallback>{(user?.name || 'AD').substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={firstName} className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={lastName} className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} className="bg-secondary border-0" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 234 567 890" className="bg-secondary border-0" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 card-shadow space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what notifications you want to receive
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Order Updates", desc: "Get notified when orders are placed or updated" },
                  { title: "Low Stock Alerts", desc: "Receive alerts when products are running low" },
                  { title: "Customer Messages", desc: "Be notified when customers send messages" },
                  { title: "Weekly Reports", desc: "Receive weekly performance summaries" },
                  { title: "Marketing Updates", desc: "Tips and product updates from our team" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={index < 3} />
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 card-shadow space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your password and security preferences
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" className="bg-secondary border-0" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" className="bg-secondary border-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" className="bg-secondary border-0" />
                    </div>
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 card-shadow space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">Store Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your store preferences and details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue={org?.name || "Commerce Pro"} className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input id="storeUrl" defaultValue={org?.slug ? `${org.slug}.store` : ""} className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="USD ($)" className="bg-secondary border-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (EST)" className="bg-secondary border-0" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">Save Store Settings</Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
