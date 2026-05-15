/**
 * Settings Screen
 * Integration management and app settings
 */

import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SyncStatus } from '@/components/sync-status';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useSyncStatus } from '@/hooks/use-sync-status';
import { useThemeColor } from '@/hooks/use-theme-color';
import { mockIntegrations } from '@/services/mock-data';

export default function SettingsScreen() {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const buttonPrimary = useThemeColor({}, 'buttonPrimary');
  const bgColor = useThemeColor(
    { light: '#f8f9fa', dark: '#1c1c1e' },
    'background'
  );

  const { user, logout } = useAuth();
  const { status: syncStatus, triggerSync, isSyncing } = useSyncStatus();

  // Mock integration state
  const [grafanaUrl, setGrafanaUrl] = useState(
    mockIntegrations[0].config.url || ''
  );
  const [grafanaApiKey, setGrafanaApiKey] = useState('••••••••••••••••');
  const [githubOrg, setGithubOrg] = useState(
    mockIntegrations[1].config.org || ''
  );
  const [githubRepo, setGithubRepo] = useState(
    mockIntegrations[1].config.repo || ''
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSync = async (integration: 'grafana' | 'github') => {
    try {
      await triggerSync(integration);
      Alert.alert('Success', `${integration} synced successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to sync ${integration}`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleSaveIntegration = (integration: string) => {
    Alert.alert('Saved', `${integration} configuration saved (mock)`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
            Account
          </ThemedText>
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.accountRow}>
              <View style={styles.avatarPlaceholder}>
                <ThemedText style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </ThemedText>
              </View>
              <View style={styles.accountInfo}>
                <ThemedText style={styles.accountName}>
                  {user?.name || 'User'}
                </ThemedText>
                <ThemedText style={[styles.accountEmail, { color: iconColor }]}>
                  {user?.email || 'user@example.com'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
            Integrations Status
          </ThemedText>
          <SyncStatus
            status={syncStatus}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        </View>

        {/* Grafana Integration */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
            Grafana Configuration
          </ThemedText>
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Instance URL</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={grafanaUrl}
                onChangeText={setGrafanaUrl}
                placeholder="https://grafana.company.com"
                placeholderTextColor={iconColor}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>API Key</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={grafanaApiKey}
                onChangeText={setGrafanaApiKey}
                placeholder="Your Grafana API key"
                placeholderTextColor={iconColor}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: buttonPrimary }]}
              onPress={() => handleSaveIntegration('Grafana')}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* GitHub Integration */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
            GitHub Configuration
          </ThemedText>
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Organization</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={githubOrg}
                onChangeText={setGithubOrg}
                placeholder="your-org"
                placeholderTextColor={iconColor}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Repository</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={githubRepo}
                onChangeText={setGithubRepo}
                placeholder="main-app"
                placeholderTextColor={iconColor}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: buttonPrimary }]}
              onPress={() => handleSaveIntegration('GitHub')}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
            Preferences
          </ThemedText>
          <View style={[styles.card, { backgroundColor: bgColor }]}>
            <View style={styles.toggleRow}>
              <View>
                <ThemedText style={styles.toggleLabel}>
                  Push Notifications
                </ThemedText>
                <ThemedText style={[styles.toggleDescription, { color: iconColor }]}>
                  Get notified about critical alerts
                </ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: tintColor }}
              />
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <ThemedText style={[styles.versionText, { color: iconColor }]}>
            ObservaSync v1.0.0 (Mock)
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  saveButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    height: 50,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  versionText: {
    fontSize: 12,
  },
});
