/**
 * API Configuration
 * Manages environment variables for external services.
 */

export const API_CONFIG = {
    hotpepper: {
        apiKey: process.env.EXPO_PUBLIC_HOTPEPPER_API_KEY || '',
        baseUrl: 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/',
    },
};

// Error check in development
if (!API_CONFIG.hotpepper.apiKey && __DEV__) {
    console.warn(
        'Hotpepper API Key is not set. Please create a .env file and set EXPO_PUBLIC_HOTPEPPER_API_KEY.'
    );
}
