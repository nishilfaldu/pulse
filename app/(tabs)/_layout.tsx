import { Tabs } from 'expo-router';
import { Ghost, MapIcon, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

// Modals
import { Header } from '@/components/header';
import { ChatModal } from '@/components/modals/chat-modal';
import { MysteryModal } from '@/components/modals/mystery-modal';
import { ProfileModal } from '@/components/modals/profile-modal';
import { VaultModal } from '@/components/modals/vault-modal';
import { MysteryPopup } from '@/components/mystery-popup';
import { COLORS } from '@/constants/theme';

function TabBarIcon(props: {
    icon: React.ElementType;
    color: string;
}) {
    const Icon = props.icon;
    return <Icon size={28} color={props.color} style={{ marginBottom: -3 }} />;
}

export default function TabLayout() {
    // Global State for Modals
    const [mysteryActive, setMysteryActive] = useState(false);
    const [showMysteryModal, setShowMysteryModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showVaultModal, setShowVaultModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);

    // Simulate random mystery notification
    useEffect(() => {
        const timer = setTimeout(() => {
            setMysteryActive(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Custom Header is rendered above Tabs, or we can disable header in tabs and render it here? 
          Actually, the user's request has headers in tabs. 
          But my app has a specific custom header. 
          I will disable the default header in tabs and use my custom header if possible, 
          OR I can put the header in the layout wrapping the Tabs.
          
          The user's code: headerShown: useClientOnlyValue(false, true)
          This implies headers ARE shown.
          
          However, my Header.tsx is very custom. 
          I'll stick to the user's request structure but maybe hide the default header and put mine in a wrapper?
          Or just use the default header? 
          My Header.tsx has "Vault" and "Profile" buttons.
          
          Let's wrap the Tabs with the Header and Modals.
      */}

            <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
                <Header
                    onProfileClick={() => setShowProfileModal(true)}
                    onVaultClick={() => setShowVaultModal(true)}
                />

                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: '#FF7E47',
                        tabBarInactiveTintColor: '#9CA3AF',
                        headerShown: false, // We use our custom header
                        tabBarStyle: {
                            height: 80,
                            borderTopWidth: 3,
                            borderTopColor: '#1A1A1A',
                            paddingBottom: 16,
                            paddingTop: 12,
                            backgroundColor: 'white',
                        },
                        tabBarLabelStyle: {
                            fontSize: 10,
                            fontWeight: '900',
                            textTransform: 'uppercase',
                        }
                    }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            title: 'Vibes',
                            tabBarIcon: ({ color }) => <TabBarIcon icon={Zap} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="peeper"
                        options={{
                            headerShown: false,
                            title: 'Peeper',
                            tabBarIcon: ({ color }) => <TabBarIcon icon={Ghost} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="map"
                        options={{
                            headerShown: false,
                            title: 'City',
                            tabBarIcon: ({ color }) => <TabBarIcon icon={MapIcon} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="live"
                        options={{
                            headerShown: false,
                            title: 'Live',
                            tabBarIcon: ({ color }) => <TabBarIcon icon={Zap} color={color} />,
                        }}
                    />
                </Tabs>

                {/* Global Modals */}
                {mysteryActive && !showMysteryModal && (
                    <MysteryPopup onOpen={() => { setShowMysteryModal(true); }} />
                )}
                <MysteryModal isOpen={showMysteryModal} onClose={() => setShowMysteryModal(false)} />
                <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
                <VaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />
                <ChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} />
            </View>
        </>
    );
}
