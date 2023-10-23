import sdk from '@ory/client'

const SDK_URL = process.env.ORY_SDK_URL
const DEV = process.env.DEV

if (!SDK_URL && !DEV) {
  console.log('ORY_SDK_URL is not set in the environment.')
  console.log('Either set DEV=true or define ORY_SDK_URL')
  process.exit(1)
}

export const ory = new sdk.FrontendApi(
  new sdk.Configuration({
    basePath: process.env.ORY_SDK_URL
  })
)