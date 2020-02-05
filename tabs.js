function changeTab(tab, action) {
    port.postMessage({
        tab: parseInt(tab),
        action: action
    });
}

function updateTabs(data) {
    var tabs = document.querySelector('#tabs');
    tabs.innerHTML = data.tabs;
    for (var i = 0; i < tabs.children.length; i++) {
        if (tabs.children[i].dataset.id == data.tabId) {
            tabs.children[i].className += ' active';
        }
        tabs.children[i].onclick = function(e) {
            changeTab(this.dataset.id, e.button == 1 ? 'close' : 'activate');
        };
    }
}

var port = chrome.runtime.connect({name: 'tabs'});
port.onMessage.addListener(updateTabs);

window.onload = function(){
    var button = document.querySelector('.hide-click');
    button.onclick = function(){
        chrome.tabs.executeScript({ code: 'hideBar.unHideAfterClickAction.action();' });
    };
}

const keyM = 77;
window.addEventListener('keyup', function(e){
    if(e.which === keyM && e.ctrlKey){
        chrome.tabs.executeScript({ code: 'hideBar.hideAction();' })
    }
} );


