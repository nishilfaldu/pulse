import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#FFF8F0', // Warm cream/paper
  text: '#1A1A1A',
  border: '#1A1A1A',
  primary: {
    orange: '#FF7E47',
    blue: '#4A90E2',
    green: '#7ED321',
    pink: '#FF5E7D',
    yellow: '#F8E71C',
    purple: '#9B51E0',
    red: '#FF4444',
    black: '#1A1A1A', // Mystery
  },
  accent: {
    orange: '#FF7E47',
    blue: '#4A90E2',
    green: '#7ED321',
    pink: '#FF5E7D',
    purple: '#9B51E0',
    red: '#FF4444'
  }
};

// Helper for shadows since RN handles them differently on iOS/Android
export const SHADOWS = {
  hard: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6, // Android approximation
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  }
};

export const STYLES = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#1A1A1A',
    borderRadius: 24,
    ...SHADOWS.hard,
  },
  flatCard: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#1A1A1A',
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#1A1A1A',
    ...SHADOWS.small,
  },
  buttonText: {
    fontWeight: '900',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
