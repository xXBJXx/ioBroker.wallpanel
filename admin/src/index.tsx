// UI elements are imported from Material-UI
// import from iobroker-react docu page => https://github.com/AlCalzone/iobroker-react
import { SettingsApp } from 'iobroker-react/app';
import { useConnection, useSettings } from 'iobroker-react/hooks';
import type { Translations } from 'iobroker-react/i18n';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AdapterHeader } from './component/AdapterHeader';
import { SettingPage } from './SettingPage';

// eslint-disable-next-line react/display-name
const SettingsPageContent: React.FC = React.memo(() => {
	// settings is the current settings object, including the changes made in the UI
	// originalSettings is the original settings object, as it was loaded from ioBroker
	// setSettings is used to update the current settings object
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { settings, originalSettings, setSettings } = useSettings<ioBroker.AdapterConfig>();

	// Updates the settings when the checkbox changes. The changes are not saved yet.
	const handleChange = <T extends keyof ioBroker.AdapterConfig>(
		option: T,
		value: ioBroker.AdapterConfig[T],
	) => {
		setSettings((s) => ({
			...s,
			[option]: value,
		}));
	};

	const connection = useConnection();
	const [mqttInstance, setMqttInstance] = useState<string[]>([]);
	const mqttInstanceCall = React.useCallback(async (): Promise<void> => {
		const result = await connection.getObjectView(
			'system.adapter.mqtt',
			'system.adapter.mqtt.\u9999',
			'instance',
		);
		if (!result) console.error('Failed to get mqtt instances');
		const instance: string[] = [];
		if (result) {
			for (const key of Object.keys(result)) {
				instance.push(result[key]._id.split('.').slice(2).join('.'));
			}

			console.log('All Mqtt instances that are available have been loaded => ', instance);
			setMqttInstance(instance);
			if (instance.length === 0) {
				if (settings.mqttInstalled) handleChange('mqttInstalled', false);
			} else {
				if (!settings.mqttInstalled) handleChange('mqttInstalled', true);
			}
			return;
		}
	}, [connection]);

	useEffect(() => {
		(async () => {
			await mqttInstanceCall();
			return;
		})();
	}, []);

	return (
		<React.Fragment>
			<AdapterHeader />
			<SettingPage
				mqttInstance={mqttInstance}
				settings={settings}
				onChange={(option, value) => handleChange(option, value)}
			/>
		</React.Fragment>
	);
});

const migrateSettings = (settings: ioBroker.AdapterConfig) => {
	// Here's an example for editing settings after they are loaded from the backend
	// In this case, option1 will be set to true by default
	if (settings.interval === undefined) {
		settings.interval = 30;
	}
	if (settings.mqttInstance === undefined) {
		settings.mqttInstance = 'mqtt.0';
	}
	if (settings.enabledMqtt === undefined) {
		settings.enabledMqtt = false;
	}
	if (settings.devices === undefined) {
		settings.devices = [];
	}
};

// Load your translations
const translations: Translations = {
	en: require('./i18n/en.json'),
	de: require('./i18n/de.json'),
	ru: require('./i18n/ru.json'),
	pt: require('./i18n/pt.json'),
	nl: require('./i18n/nl.json'),
	fr: require('./i18n/fr.json'),
	it: require('./i18n/it.json'),
	es: require('./i18n/es.json'),
	pl: require('./i18n/pl.json'),
	'zh-cn': require('./i18n/zh-cn.json'),
};

const Root: React.FC = () => {
	return (
		<SettingsApp name="Wallpanel" afterLoad={migrateSettings} translations={translations}>
			<SettingsPageContent />
		</SettingsApp>
	);
};

ReactDOM.render(<Root />, document.getElementById('root'));
