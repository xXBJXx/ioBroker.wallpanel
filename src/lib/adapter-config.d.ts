// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface Devices {
			name: string;
			ip: string;
			port: number;
			topic: string;
			enabled: boolean;
			mqttEnabled: boolean;
		}
		interface AdapterConfig {
			interval: number;
			devices: Devices[];
			enabledMqtt: boolean;
			mqttInstance: string;
			mqttInstalled: boolean;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
