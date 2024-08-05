/**
 * Configuration object for the application.
 * Testcafe has a limitation where it cannot access .testcaferc.json variables, so this class was created to provide a single source of truth for the application's URLs.
 */
const config = {
    url: 'http://localhost', 
    uiPort: '3001',
    apiPort: '3000',
    endpointDevices: '/devices',

    /**
     * Returns the base URL for the application.
     * @returns The base URL.
     */
    baseUrl: function() {
        return `${this.url}:${this.uiPort}`;
    },

    /**
     * Returns the API URL for retrieving devices.
     * @returns The API URL for devices.
     */
    apiUrlDevices: function() {
        return `${this.url}:${this.apiPort}${this.endpointDevices}`;
    }
};

export default config;
