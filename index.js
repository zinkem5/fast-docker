/**

  FAST HTTP
  Author: Matthew Zinke <m.zinke@f5.com>

  FAST HTTP will quickly stand up an HTTP service for rendering
  volume mounted FAST Templates.

  Each template in the volume will be mapped to a URL endpoint
  using the title in the template.

*/

const fs = require('fs');
const http = require('http');

const util = require('util');
const ls = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const yaml = require('js-yaml');
const app = require('polka');

const fast = require('@f5devcentral/f5-fast-core');

const basedir = process.env.F5_FAST_TEMPLATE_ROOT || './templates';
const templates = {};

console.log(`basedir ${basedir}`);

const simpleTestPoc = (input) => input*2;

const httpListTemplates = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(Object.keys(templates)));
};

const httpGetHtmlForm = (req, res) => {
  const press = templates[req.params.path.toLowerCase()];
  if(press) {
    res.setHeader('Content-Type', 'text/html');
    res.end(fast.guiUtils.generateHtmlPreview(
      press.getParametersSchema(),
      press.getCombinedParameters({})
    ) + `
    <script>

    let auth_string = null;

    const submit_button = document.createElement('button');
    submit_button.innerText = 'Submit';
    submit_button.addEventListener('click',function() {
      // Get the value from the editor
      console.log(editor.getValue());

      const fetchOpts = {
          method: 'POST',
          body: JSON.stringify(editor.getValue())
      }

      if(auth_string && auth_string.length > 0) {
        fetchOpts.headers = new Headers({
            Authorization: auth_string
        });
      };

      fetch('/${press.parsedSource.id.toLowerCase()}', fetchOpts)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const response_div = document.createElement('tt');
        response_div.innerText = JSON.stringify(data,null,2);
        document.body.appendChild(response_div);
      })
      .catch(e => console.log(e))

    });
    // Hook up the submit button to log to the console
    document.body.appendChild(submit_button);

    document.body.appendChild(document.createElement('br'));

    // form field to add auth header
    const token_entry = document.createElement('input');
    token_entry.id = 'auth'


    document.body.appendChild(token_entry);

    const token_entry_button = document.createElement('button');

    token_entry_button.innerText = 'Add Authorization String to Headers'
    token_entry_button.addEventListener('click', () => {
      console.log('eventlistener', token_entry);
        const header = document.getElementById('auth');
        auth_string = header.value;
        console.log('clicked', auth_string, token_entry_button.value);
    });

    document.body.appendChild(token_entry_button);

    console.log('all stuff should be done...');
    </script>
    `);
  } else {
    res.end('404: template not found');
  }
};

const httpGetTemplate = (req, res) => {
  const press = templates[req.params.path.toLowerCase()];
  if(press) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(press._parametersSchema));
  } else {
    res.end('404: template not found');
  }
};


const _http = require('http');
const _https = require('https');
const USER_AGENT_STRING = 'FAST Docker httpForward v0.0.0';
const httpForward = (opts, payload) => {
  const protocol = opts.protocol !== 'https:' ? _http : _https;
  console.log('httpForward', opts);
  if(!opts.headers)
    opts.headers = {};

  if(!opts.headers['User-Agent']) {
    opts.headers['User-Agent'] = USER_AGENT_STRING;
  }
  console.log('makeRequest', opts);
  return new Promise((resolve, reject) => {
    const req = protocol.request(opts, (res) => {
      console.log(res.statusCode);
      console.log(res.headers);

      res.on('error', (err) => {
        console.error('response error;'+err);
      });

      if( res.statusCode >= 300 && res.statusCode < 400 ) {
        if(res.headers && res.headers.location) {
          const parsed = url.parse(res.headers.location);
          return makeRequest(Object.assign(opts, parsed), payload);
        } else {
          return reject(new Error('Redirected, but No Location header'));
        }
      }

      if( res.headers['content-type'] === 'application/octet-stream') {
        // handle file download, works on github at least...
        const cd = parseContentDisposition(res.headers['content-disposition']);

        //const fstream = fs.createWriteStream(cd.filename, {autoclose: false});
        //res.pipe(fstream);
        let bytes_recieved = 0;
        res.on('data', (data) => {
          bytes_recieved += data.length
        })
        res.on('end', () => {
          console.log(`${bytes_recieved} recieved`)
          return resolve({
            options: opts,
            status: res.statusCode,
            headers: res.headers,
            file: cd.filename
          });
        });

      } else {
        // ... other content assumed to be utf8, for now ...
        const buffer = [];
        res.setEncoding('utf8');
        res.on('data', (data) => {
          buffer.push(data);
        });
        res.on('end', () => {
          let body = buffer.join('');
          console.log(body);
          return resolve({
            options: opts,
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      }
    });

    req.on('error', (e) => {
      console.log('error making http request');
      console.log(e.message);
      console.log(e.stack);
      //reject(new Error(`${opts.host}:${e.message}`));
    });

    if (payload) req.write(payload);
    req.end();
  })
  .catch((e) => {
    throw new Error(`makeRequest: ${e.stack}`);
  })
};


const httpPostTemplate = (req, res) => {
  const press = templates[req.params.path.toLowerCase()];
  if(press) {
    const buffer = [];
    req.on('data', (data) => {
      buffer.push(data.toString('utf8'));
    });
    req.on('end', () => {
      const params = JSON.parse(buffer.join(''));
      //console.log(params);
      const rendered = press.render(params);

      if( press.parsedSource.httpForward ) {
        const httpForwardOpts = press.parsedSource.httpForward.options;

        //forward auth header if none exists on the httpForward spec
        if(!httpForwardOpts.headers.Authorization && req.headers.Authorization)
          httpForwardOpts.headers.Authorization = req.headers.Authorization;
        else if(!httpForwardOpts.headers.Authorization && req.headers.authorization)
          httpForwardOpts.headers.Authorization = req.headers.authorization;

        console.log('auth string', req.headers.Authorization, req.headers.authorization);

        httpForward(httpForwardOpts, rendered)
          .then((responseData) => {
            res.statusCode = responseData.status;
            Object.keys(responseData.headers)
              .forEach((key) => {
                console.log(key, responseData.headers[key]);
                res.setHeader(key, responseData.headers[key]);
              });
            if(res.statusCode === 401) {
              res.statusCode = 401;
              res.setHeader('WWW-Authenticate', 'Basic');
            }

            res.end(responseData.body);
          });
      } else {
        res.end(press.render(params));
      }
    });
    req.on('error', () => {
      res.end('500: template error');
    });
  } else {
    res.end('404: template not found');
  }
};

const server = app();
server.get('/', httpListTemplates);
server.get('/html/:path', httpGetHtmlForm);
server.get('/:path', httpGetTemplate);
server.post('/:path', httpPostTemplate);


//main promise chain listens on port 3000
ls(basedir)
  .then((list) => {
    return Promise.all(list.map(fname => readFile(basedir + '/' + fname)));
  })
  .then((results) => {
    const files = results.map(x => x.toString('utf8'));
    return Promise.all(files.map(raw => {
      return fast.Template.loadYaml(raw)
      .then((becomingTemplate) => {
        becomingTemplate.parsedSource = yaml.safeLoad(raw);
        return becomingTemplate;
      })
    }))
  })
  .then((results) => {
    results.forEach((item) => {
      const template = item;
      templates[template.parsedSource.id.toLowerCase()] = template;
    });
    // template set loaded in cache at this point

    //server start
    server.listen(80);
  });


module.exports = {
  httpGetTemplate,
  httpPostTemplate,
  simpleTestPoc
}
