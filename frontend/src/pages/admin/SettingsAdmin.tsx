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
        siteName: 'Blossom Boutique',
        siteDescription: 'Elevated lifestyle essentials for the modern minimalist.',
        contactEmail: 'hello@blossom.com',
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
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-dark tracking-tight">System Settings</h2>
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Configure your digital storefront</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-primary transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                </button>
            </div>

            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center gap-3 text-secondary"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Settings updated successfully!</span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-dark/30">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-dark">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Store Description</label>
                                <textarea
                                    value={settings.siteDescription}
                                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                    rows={3}
                                    className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-dark/30">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-dark">Security & Privacy</h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-dark">Two-Factor Authentication</span>
                                    <span className="text-xs text-gray-400">Add an extra layer of security to your account.</span>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enableTwoFactor: !settings.enableTwoFactor })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${settings.enableTwoFactor ? 'bg-secondary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.enableTwoFactor ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-dark">Maintenance Mode</span>
                                    <span className="text-xs text-gray-400">Temporarily disable storefront access for customers.</span>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="flex flex-col gap-8">
                    <div className="p-8 bg-dark text-white rounded-[40px] shadow-2xl flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-primary" />
                            <h4 className="text-sm font-black uppercase tracking-widest">Notifications</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            Manage how the system alerts you about new orders, low stock, and security events.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                checked={settings.enableNotifications}
                                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                                className="w-5 h-5 rounded-lg border-white/20 bg-white/5 accent-primary"
                            />
                            <span className="text-xs font-bold">In-app Alerts Enabled</span>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm flex flex-col gap-6">
                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Connect Support</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-dark">{settings.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <Smartphone className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-dark">{settings.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsAdmin;
