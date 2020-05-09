# FAST Docker

A prototype configurable MVP of FAST Container [@f5devcentral/f5-fast-core](https://www.npmjs.com/package/@f5devcentral/f5-fast-core)

# Usage

```
docker build --tag fastdock .
docker run -p 3000:3000 -v <YOUR TEMPLATE DIR>:/var/config/templates fastdock
```

Uses FAST F5 Application Templates

## `/<TEMPLATE_TITLE>`

### `GET`

Get the template schema.

### `POST`

Post Template Parameters, and get a rendered template in response.

Body must conform to schema from GET.

# Known Issues

TODO: Error handling
TODO: Tests
TODO: API Forwarder Endpoint
