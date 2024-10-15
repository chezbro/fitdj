import Constants from 'expo-constants';

export function getEnvVariable(key: string): string {
  const value = Constants.expoConfig?.extra?.[key];
  if (value === undefined) {
    throw new Error(`Env variable ${key} is not set`);
  }
  return value;
}
