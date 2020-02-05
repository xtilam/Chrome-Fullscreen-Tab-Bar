tabs = document.createElement('iframe');
tabs.setAttribute('src', chrome.extension.getURL('tabs.html'));
tabs.setAttribute('class', 'full-screen-bar');
tabs.style.position = 'fixed';
tabs.style.height = '12px';
tabs.style.maxHeight = '12px';
tabs.style.minHeight = '0';
tabs.style.bottom = '0';
tabs.style.left = '0';
tabs.style.width = '100%';
tabs.style.zIndex = '9999999';
tabs.style.border = 'none';

document.documentElement.appendChild(tabs);

const keyM = 77;
const hideBar = {
	hideStatus: false,
	unHideAfterClickStatus: false,
	hideAction: function (){
		if(this.hideStatus){
			tabs.style.display = 'unset';
			this.hideStatus = false;
		}else{
			this.hideStatus = true;
			tabs.style.display = 'none';
		};
		if(unHideAfterClickStatus){
			document.removeEventListener('click', this.unHideAfterClickAction.event);
			this.unHideAfterClickStatus = false;
		}
	},
	unHideAfterClickAction: {
		event: function(){
			tabs.style.display = 'unset';
			document.removeEventListener('click', hideBar.unHideAfterClickAction.event);
			hideBar.unHideAfterClickStatus = false;
		},
		action: function(){
			if(!hideBar.hideStatus && !hideBar.unHideAfterClickStatus){
				hideBar.unHideAfterClickStatus = true;
				tabs.style.display = 'none';
				document.addEventListener('click', this.event);
			}
		}

	}
}

window.addEventListener('keyup', function(e){
	if(e.which === keyM && e.ctrlKey){
		hideBar.hideAction();
	}
} );

