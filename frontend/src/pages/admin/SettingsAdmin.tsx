import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Globe, 
    Bell, 
    Shield, 
    Mail, 
    Smartphone, 
    Save, 
    Loader2,
    CheckCircle2
} from 'lucide-react';

const SettingsAdmin = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'IZZA Collection',
        siteDescription: 'Elevated lifestyle essentials for the modern minimalist.',
        contactEmail: 'hello@izzacollection.com',
        phoneNumber: '+1 (555) 123-4567',
        enableNotifications: true,
        enableTwoFactor: false,
        maintenanceMode: false
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">System Settings</h2>
                    <p className="text-sm text-muted font-body">Configure and manage your digital storefront preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-dark text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none min-w-[200px]"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                </button>
            </div>

            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 rounded-2xl border border-green-200 flex items-center gap-3 text-green-700 shadow-sm"
                >
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                    <span className="text-sm font-semibold">Settings updated seamlessly.</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-8">
                        <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark border border-primary/10">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-heading font-bold text-dark">General Information</h3>
                                <p className="text-sm text-muted font-medium">Basic details about your store.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-dark uppercase tracking-wider ml-1">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="px-5 py-3.5 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all focus:bg-white placeholder:text-muted"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-dark uppercase tracking-wider ml-1">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="px-5 py-3.5 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all focus:bg-white placeholder:text-muted"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-xs font-bold text-dark uppercase tracking-wider ml-1">Store Description</label>
                                <textarea
                                    value={settings.siteDescription}
                                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                    rows={3}
                                    className="px-5 py-3.5 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all focus:bg-white resize-none placeholder:text-muted"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-8">
                        <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-dark border border-primary/10">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-heading font-bold text-dark">Security & Privacy</h3>
                                <p className="text-sm text-muted font-medium">Manage access and site protection.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-primary/10 group hover:border-primary/10 transition-colors">
                                <div className="flex flex-col gap-1 pr-4">
                                    <span className="text-base font-bold text-dark">Two-Factor Authentication</span>
                                    <span className="text-sm text-muted font-medium leading-relaxed">Add an extra layer of security requiring a code on login.</span>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enableTwoFactor: !settings.enableTwoFactor })}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors flex-shrink-0 ${settings.enableTwoFactor ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.enableTwoFactor ? 'translate-x-8' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100 group hover:border-red-200 transition-colors">
                                <div className="flex flex-col gap-1 pr-4">
                                    <span className="text-base font-bold text-dark">Maintenance Mode</span>
                                    <span className="text-sm text-muted font-medium leading-relaxed">Temporarily hide the storefront from public access.</span>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors flex-shrink-0 ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="flex flex-col gap-8">
                    <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center">
                                <Bell className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-heading font-bold text-dark">Notifications</h4>
                        </div>
                        <p className="text-sm text-muted font-medium leading-relaxed relative z-10">
                            Manage alerts for new orders, low stock, and security anomalies.
                        </p>
                        <div className="flex items-center gap-4 pt-4 border-t border-primary/10 mt-2 relative z-10">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${settings.enableNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <span className="text-sm font-bold text-dark">In-app Alerts Enabled</span>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-6">
                        <h4 className="text-lg font-heading font-bold text-dark">Support Contacts</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-primary/10">
                                <div className="w-10 h-10 bg-white shadow-sm border border-primary/10 rounded-xl flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-gray-500" />
                                </div>
                                <span className="text-sm font-semibold text-dark">{settings.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-primary/10">
                                <div className="w-10 h-10 bg-white shadow-sm border border-primary/10 rounded-xl flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-gray-500" />
                                </div>
                                <span className="text-sm font-semibold text-dark">{settings.phoneNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-primary/10 border-dashed flex flex-col items-center justify-center text-center gap-2 mt-auto">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Version Info</span>
                        <span className="text-sm font-medium text-dark">Blossom Admin v4.2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsAdmin;
