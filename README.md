## What's this?

A Cloudflare Worker that enhances AWS Cognito's [userinfo endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html) compatibility with OpenID Connect standards.

## What does it do

This worker intercepts AWS Cognito's userinfo endpoint responses and transforms specific attributes to ensure OpenID Connect compliance:

- Converts `email_verified` from `string` to `boolean`
- Converts `phone_verified` from `string` to `boolean`

These transformations ensure compatibility with the OpenID Connect [Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) specification.

## Use Cases

This worker will be useful when integrating AWS Cognito with:

- [openidconnect-rs](https://github.com/ramosbugs/openidconnect-rs)
- [Proxmox VE](https://www.proxmox.com/en/proxmox-ve)
- Other systems requiring strict OpenID Connect compliance

Without this worker, you might encounter errors like:

```shell
pvedaemon[1234]: openid authentication failure; rhost=::ffff:100.88.111.216 msg=Failed to contact userinfo endpoint: Failed to parse server response
```

## Prerequisites

Before deployment, ensure you have:

- An AWS Cognito user pool with a custom domain configured (Figure 1) 
- The custom domain's DNS records managed in Cloudflare (Figure 2)

## Instructions

### Enable Proxy Status of the custom domain (Figure 2)

- Log into your Cloudflare dashboard
- Locate your custom domain record
- Enable the "Proxy" status (orange cloud)

### Deploy the Worker

- Clone this repository
- Deploy to Cloudflare Workers using Wrangler or the Cloudflare dashboard

### Configure Worker Route (Figure 3)

- [Add a Worker route](https://developers.cloudflare.com/workers/configuration/routing/routes/) to intercept the userinfo endpoint
- Pattern: `your.custom-domain.com/oauth2/userInfo` which is the same as the `userinfo_endpoint` of your user pool's openid configuraiton.

### Figures

| | |
| -- | -- |
| 1 | ![image](https://github.com/user-attachments/assets/00f0bec7-4d1d-4aa3-9ca8-dc185b377a22) |
| 2 | ![image](https://github.com/user-attachments/assets/f89e0aa2-fc13-48b4-8b2d-662352b70c4e) |
| 3 | ![image](https://github.com/user-attachments/assets/1d58750d-e8cc-4c31-9258-f88699299e52) |
