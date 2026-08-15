import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Chromium is preinstalled in this environment; Remotion downloads its own
// otherwise. Harmless when the path does not exist.
