# SOAP Server for Node-RED
Listen for an incoming SOAP request used to start a Node-RED flow and pass in input data.

## Installation
Use `npm install node-red-contrib-soapserver` to install.

## Usage
This package provides a node that can be used to start a Node-RED flow.  The node is called
`soap server` and listens on a configurable TCP port on the host on which Node-RED run.
It is important that the port number be supplied as there is no default assumed.
The listener is listening for an incoming SOAP/HTTP request.  The WSDL that describes the
SOAP server can be retrieved through an HTTP GET request using the `/soap?wsdl` URL and query
parameters.  For example:

```
http://<node-RED-Host>:<port>/soap?wsdl
```

The endpoint for the SOAP request is found at the same address ...

```
http://<node-RED-Host>:<port>/soap
```

The interface supplies one operation called `startFlow` which takes a single parameter as input
of type string.  When a client invokes that operation, a new Node-RED flow is initiated.  The
passed in data appears in the `msg.payload` property of the Node-RED message.

A Node-RED flow that starts with a `soap server` node should also conclude with a corresponding
`soap server` output node.  This is used to pass back a value to the original SOAP client.  The
string found in `msg.payload` is returned as the response value.

## Notes
* When re-deploying a flow which contains a `soap server` node, the previously deployed flow
may wait up to 120 seconds before allowing itself to stop.  The reason for this is that it can be up to 120 seconds from the last received transmission from a closing
TCP/IP socket before we can be sure that there is no more incoming traffic.  The listening SOAP server running inside node-RED can't stop and restart within 120 seconds of the last received message.


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## History
* 2015-02-25 - First release

## Credits
Neil Kolban

## License
Apache 2.0