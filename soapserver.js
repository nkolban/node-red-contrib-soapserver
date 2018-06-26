/**
 * Copyright 2015 Neil Kolban.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 
/**
 * Implement a SOAP listener within a Node-RED environment.
 * This module makes extensive use of the project called "vpulim/node-soap"
 * found on Github at:
 * 
 * https://github.com/vpulim/node-soap
 * 
 * 
 */
module.exports = function(RED) {
  function SoapServerNode(config) {
    var thisNode = this;
    
    RED.nodes.createNode(thisNode, config);
    // node-specific code goes here
    var soap = require("soap");
    var http = require("http");
    var port = parseInt(config.port);
    if (isNaN(port)) {
      thisNode.error("No port for soap server node!");
      thisNode.status({fill: "red", shape: "ring", text: "not listening"});
      return;
    }
    
    // Setup an HTTP server to listen for incoming HTTP requests.
    var server = http.createServer(function(request, response){
      response.end("404: Not found: " + request.url);
    });

    // Define the node-soap service definition.
    var nodeRedService = {
      NodeRED: {    // Service name
        NodeRED: {  // Binding name
// Define a handler function for an incoming SOAP request for this flow.  The
// handler function takes the SOAP data and adds it to the payload property of
// the msg.  In addition, the SOAP response callback is added into the msg
// such that it may later be used to send a soap response.
// The WSDL exposed by this service is fixed and hence we know what will be
// incoming.  The args will contain a property called "payload" and that is what we will
// set to the `msg` payload:
          startFlow: function(args, soapResponseCallback) {
            var payload = args.payload;
            thisNode.send({
              "payload": payload,
              "_soapServer_soapResponseCallback": soapResponseCallback
            });
          }, // End of startFlow function
          startFlowOneWay: function(args) {
            thisNode.log("startFlowOneWay");
          } // End of startFlowOneWay
        } // End of binding name
      } // End of service name
    }; // End of service definition

    // The WSDL data is the XML document that represents the WSDL that is the
    // specification of the SOAP request honored by this node.  The WSDL can
    // be turned into a text string by passing it through a converter such as the
    // one found on-line here:
    // http://www.howtocreate.co.uk/tutorials/jsexamples/syntax/prepareInline.html
    //
    var wsdl = '<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<wsdl:definitions name=\"NodeRED\" targetNamespace=\"http:\/\/www.neilkolban.com\/NodeRED\/\" xmlns:soap=\"http:\/\/schemas.xmlsoap.org\/wsdl\/soap\/\" xmlns:tns=\"http:\/\/www.neilkolban.com\/NodeRED\/\" xmlns:wsdl=\"http:\/\/schemas.xmlsoap.org\/wsdl\/\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\">\n  <wsdl:types>\n    <xsd:schema targetNamespace=\"http:\/\/www.neilkolban.com\/NodeRED\/\">\n      <xsd:element name=\"NodeREDPayload\" type=\"tns:NodeREDPayload\"><\/xsd:element>\n      <xsd:complexType name=\"NodeREDPayload\">\n      \t<xsd:sequence>\n      \t\t<xsd:element name=\"payload\" type=\"xsd:string\"><\/xsd:element>\n      \t<\/xsd:sequence>\n      <\/xsd:complexType>\n    <\/xsd:schema>\n  <\/wsdl:types>\n  <wsdl:message name=\"startFlowRequest\">\n    <wsdl:part element=\"tns:NodeREDPayload\" name=\"parameters\" \/>\n  <\/wsdl:message>\n  <wsdl:message name=\"startFlowResponse\">\n    <wsdl:part element=\"tns:NodeREDPayload\" name=\"parameters\" \/>\n  <\/wsdl:message>\n  <wsdl:portType name=\"NodeRED\">\n    <wsdl:operation name=\"startFlow\">\n      <wsdl:input message=\"tns:startFlowRequest\"\/>\n      <wsdl:output message=\"tns:startFlowResponse\"\/>\n    <\/wsdl:operation>\n  <\/wsdl:portType>\n  <wsdl:binding name=\"NodeRED\" type=\"tns:NodeRED\">\n    <soap:binding style=\"document\" transport=\"http:\/\/schemas.xmlsoap.org\/soap\/http\"\/>\n    <wsdl:operation name=\"startFlow\">\n      <soap:operation soapAction=\"http:\/\/www.neilkolban.com\/NodeRED\/startFlow\"\/>\n      <wsdl:input>\n        <soap:body use=\"literal\"\/>\n      <\/wsdl:input>\n      <wsdl:output>\n        <soap:body use=\"literal\"\/>\n      <\/wsdl:output>\n    <\/wsdl:operation>\n  <\/wsdl:binding>\n  <wsdl:service name=\"NodeRED\">\n    <wsdl:port binding=\"tns:NodeRED\" name=\"NodeRED\">\n      <soap:address location=\"http:\/\/localhost:'+port+'\/soap\"\/>\n    <\/wsdl:port>\n  <\/wsdl:service>\n<\/wsdl:definitions>\n';
    soap.listen(server, "/soap", nodeRedService, wsdl);
    
    // Start listening on the HTTP port.
    server.listen(port);
    
    // A request has been made to end the flow so close the server connection
    // that is listening for incoming SOAP requests.
    thisNode.on("close", function(callback) {
      thisNode.status({fill: "yellow", shape: "dot", text: "stopping"});
      server.close(callback);
    });
    
    // Set the status of the node for the editor.
    thisNode.status({fill: "green", shape: "dot", text: "listening"});
  }
  RED.nodes.registerType("soapserver", SoapServerNode);
}
// End of file
