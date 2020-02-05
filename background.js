(function() {
    var ports = [];

    function htmlEncode( html ) {
        return document.createElement( 'a' ).appendChild(
        document.createTextNode( html ) ).parentNode.innerHTML;
    };

    function tabUpdate(win) {
        chrome.tabs.query({windowId: win}, function(tabs) {
            var html = '';
            var even = false;
            var cross = 0;
            for (var i in tabs) {
                ++cross;
                var tab = tabs[i];
                var favicon = tab.favIconUrl;
                if (!favicon || favicon.startsWith('chrome://')) {
                    favicon = 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                }
                html += '<li class="tab'
                        + ((even = !even) ? ' even' : ' odd')
                        + '" data-id="' + tab.id + '">'
                        + '{' +cross + '}'
                        + '<img src="' + favicon + '">' + htmlEncode(tab.title) + '</li>';
            }
            for (var i in ports) {
                if (ports[i].sender.tab.windowId == win) {
                    try {
                        ports[i].postMessage({tabId: ports[i].sender.tab.id, tabs: html});
                    } catch(e) {console.log('Error: ' + e);}
                }
            }
        });
    }

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {tabUpdate(tab.windowId);});
  chrome.tabs.onCreated.addListener(function (tab) {tabUpdate(tab.windowId);});
  chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {tabUpdate(removeInfo.windowId);});
  chrome.tabs.onDetached.addListener(function (tabId, detachInfo) { tabUpdate(detachInfo.oldWindowId); });

   chrome.runtime.onConnect.addListener(function(port) {
       console.assert(port.name == 'tabs');
       ports.push(port);
       port.onMessage.addListener(function(msg) {
           if (msg.action == "activate") {
               chrome.tabs.update(msg.tab, {active: true});
           } else if (msg.action == "close") {
               chrome.tabs.remove(msg.tab);
           }
       });
       port.onDisconnect.addListener(function() {
           ports.splice(ports.indexOf(port), 1);
       });
   });
})();
