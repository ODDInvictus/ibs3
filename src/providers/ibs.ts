import type { Provider } from '@auth/core/providers';
import type { Profile } from '@auth/core/types';
import { IBS_CLIENT_ID, IBS_CLIENT_SECRET } from '$env/static/private'

export const InvictusBierProvider: Provider<Profile> = {
  id: 'ibs',
  name: 'Invictus Bier Systeem',
  wellKnown: 'https://auth.oddinvictus.nl/.well-known/openid-configuration',
  authorization: 'https://auth.oddinvictus.nl/api/oidc/authorization',
  token: 'https://auth.oddinvictus.nl/api/oidc/token',
  userinfo: 'https://auth.oddinvictus.nl/api/oidc/userinfo',
  type: 'oidc',
  options: {
    clientId: IBS_CLIENT_ID,
    clientSecret: IBS_CLIENT_SECRET,
  },
}