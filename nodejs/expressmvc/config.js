
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const APP_ROOT = process.cwd();
const DEFAULT_ENVIRONMENT = 'default';

/**
 * Static fields for Config.
 */
let config = null;

class Config {
	constructor(environment = null) {
		// Declare fields.
		this._initialized = false;
		this._file = null;
		this._settings = null;

		if (environment) {
			this.load(environment);
		}
	}

	static getInstance(environment) {
		if (!config) {
			config = new Config(environment);
		}
		return config;
	}

	load(environment = DEFAULT_ENVIRONMENT) {
		const defaults = require('./config/default');

		// Locate settings file.
		const settingsFile = `${environment}.js`;
		const configPath = path.join(APP_ROOT, 'config', settingsFile);
		if (!fs.existsSync(configPath)) {
			throw new Error(`The environment's config file was not found. Add the ${settingsFile} file on the your config/ folder.`);
		}

		this._file = settingsFile;
		try {
			const settings = require(configPath);
			this._settings = _.merge({}, defaults, settings);
		} catch (err) {
			throw new Error(`There is an invalid module on ${settingsFile} file.`);
		}

		this._initialized = true;
	}

	// region "file" Accessors

	getFile() {
		return this._file;
	}

	get file() {
		return this._file;
	}

	// endregion

	// region "initialized" Accessors

	getInitialized() {
		return this._initialized;
	}

	get initialized() {
		return this._initialized;
	}

	// endregion

	get(key) {
		return this._settings[key] || null;
	}

	set(key, value) {
		this._settings[key] = value;
	}
}

exports.Config = Config;
