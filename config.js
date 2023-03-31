var config = module.exports = {};
config.dangerousCharacters = /("|&|\/|\\|\*|\+|`|~|\(|\))/g; // Regex to filter potentially dangerous characters.
config.paths = {}; //paths and further config will be added as part of docker compose
