# FAST Docker

A prototype configurable MVP of FAST Container [@f5devcentral/f5-fast-core](https://www.npmjs.com/package/@f5devcentral/f5-fast-core)

# Usage

Place a set of FAST templates inside YOUR_TEMPLATE_DIR and run the following
docker commands from the repository root:

```
docker build --tag fastdock .
docker run -p 80:80 -v <YOUR_TEMPLATE_DIR>:/var/config/templates fastdock
```

Browse to `http://localhost/html/<template title>`


All templates inside YOUR_TEMPLATE_DIR will be translated to URLs with a FAST UI
and API endpoints to render templates, or submit template output to another API.


The docker container extends the FAST template language with a new property,
`httpForward`. This property allows the author to specify an intended HTTP API
target for the template.

When the template is loaded in the browser and the submit button is clicked, the
form parameters will be sent to the container, rendered, and forwarded to the
HTTP resource specified by `httpForward`.
The response body and all headers will be proxied back to the client that made the POST request.

If `httpForward` is not present, the template will be rendered and returned to
the client in the response body.

## `/html/<TEMPLATE_TITLE>`

### `GET`

Retrieve assets to render an HTML form with a submit button that makes a POST to
`/<TEMPLATE_TITLE>`.

The browser can be directed at http://example.com/html/myTemplate if there is a
template with a title property of 'myTemplate' in the templates directory.

## `/<TEMPLATE_TITLE>`

### `GET`

Get the template schema.
A JSON body to POST must conform to this schema.

### `POST`

POST Template Parameters as JSON, and render the template.

If `httpForward` is present, forward the rendered template text to the specified
HTTP endpoint. Otherwise, return the rendered template in the response.

Body must conform to schema from GET.

```shell
curl -X POST http://localhost:3000/HelloWorld -H "Content-Type: application/json" -d '{"name":"World"}'
```

# Known Issues

TODO: Error handling
TODO: Tests
