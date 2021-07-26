
async function restoreSession(sessionInfos) {
	//console.log('restoreSession');
	if (!sessionInfos.length) {
		//console.log("No sessions found")
		return;
	}
	const sessionInfo = sessionInfos[0];
	// we dont want to restore individual tabs, only windows 
	if (!sessionInfo.tab) {
		const session = await browser.sessions.restore(sessionInfo.window.sessionId);
		// close all none pinned tabs 
		const tabIds = (await browser.tabs.query({windowId: session.window.id, pinned: false})).map(tab => tab.id);
		await browser.tabs.remove(tabIds);
	}
}

function restoreMostRecent() {
	//console.log('restoreMostRecent');
	var gettingSessions = browser.sessions.getRecentlyClosed({
		maxResults: 1
	});
	gettingSessions.then(restoreSession, console.error);
}

browser.windows.onRemoved.addListener(restoreMostRecent);
