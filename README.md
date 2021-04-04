# Serverless application on Cloudflare

Serverless application platform running on Cloudflare’s global cloud network 

## Installation

Use the package manager [wrangler](https://developers.cloudflare.com/workers/get-started/guide) to install the project.

Require
```bash
wrangler 1.15.0
```

Provide account id in **wrangler.toml** file

## How to run on local

```bash
wrangler dev
```

Running in 127.0.0.1:8787

For example: http://127.0.0.1:8787/assets/1099518651000

## How to deploy on server

```bash
wrangler publish
```
