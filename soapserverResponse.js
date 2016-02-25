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
 * Implement a SOAP responder within a Node-RED environment.
 * This module makes extensive use of the project called "vpulim/node-soap"
 * found on Github at:
 * 
 * https://github.com/vpulim/node-soap
 * 
 * 
 */
module.exports = function(RED) {
  function SoapServerResponseNode(config) {
    var thisNode = this;
    
    RED.nodes.createNode(thisNode, config);
    
    // node-specific code goes here
    // Register the function to be called when an input event arrives that needs
    // to be processed.  Our logic is to retrieve the callback function used to
    // send back a soap response.  This should be carried in the msg.  If not
    // found, this results in a warning and the function ends.
    //
    // We build a response message for the data to be sent back that is contained in
    // the msg payload property.
    //
    thisNode.on("input", function(msg) {
      var callback = msg["_soapServer_soapResponseCallback"];
      if (callback == null) {
        thisNode.warn("No previous soap server found for a soap server response.");
        return;
      }
      var payload = msg.payload;
      callback({"payload": payload});
    });
  }
  RED.nodes.registerType("soapserverResponse", SoapServerResponseNode);
}
// End of file
