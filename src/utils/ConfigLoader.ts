import { LandingPageConfig } from '@/types/config';

export class ConfigLoader {
  private static configCache: LandingPageConfig | null = null;

  static async loadConfig(): Promise<LandingPageConfig> {
    if (this.configCache) {
      return this.configCache;
    }

    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      
      const config = await response.json() as LandingPageConfig;
      this.configCache = config;
      return config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw new Error('Failed to load landing page configuration');
    }
  }

  static clearCache(): void {
    this.configCache = null;
  }
}