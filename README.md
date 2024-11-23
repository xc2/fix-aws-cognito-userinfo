## What's this?

This is a Cloudflare Worker that intercepts AWS Cognito's [userinfo endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html).

This casts `email_verified` and `phone_verified` attributes to `boolean` values - as opposed to the `string` values that AWS Cognito returns - to be compatible with OpenID Connect [Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

## What's this for?

This makes AWS Cognito works well with libraries like [openidconnect-rs](https://github.com/ramosbugs/openidconnect-rs) and applications like [Proxmox VE](https://www.proxmox.com/en/proxmox-ve).

If you're integrating AWS Cognito with such libraries or applications, you might meet errors like

```shell
pvedaemon[1234]: openid authentication failure; rhost=::ffff:100.88.111.216 msg=Failed to contact userinfo endpoint: Failed to parse server response
```

This worker can help you fix this issue.

## How to use?

### Requirements

1. You have set a custom domain for your AWS Cognito user pool.
2. You manage the custom domain's DNS records with Cloudflare.

### Steps

1. Enable the "Proxy" status of the custom domain in Cloudflare.
2. Deploy this worker to Cloudflare.
3. Add a worker route to intercept the userinfo endpoint.