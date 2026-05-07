import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
Config.setCodec('h264')

// Concurrency for Lambda — each Lambda invocation processes this many frames
Config.setConcurrency(1)
