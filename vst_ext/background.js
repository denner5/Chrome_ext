chrome.commands.onCommand.addListener(async(command) => {
    console.log("Command received: ", command); // Debugging linje
    if (command === "search") {
        // Find den aktive fane i browseren
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
        console.log("Active tab: ", tab); // Debugging linje

        // Kør funktionen 'searchHighlightedText' i den aktive fane
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: searchHighlightedText
        });
    }
});

function searchHighlightedText() {
    // Hent det markerede tekst fra den aktive fane
    const selectedText = window.getSelection().toString();
    console.log("Selected text: ", selectedText); // Debugging linje

    if (selectedText) {
        const trimmedText = selectedText.trim();

        // Kontroller om teksten er en URL
        if (trimmedText.startsWith("http") || trimmedText.startsWith("www")) {
            const url = `https://www.virustotal.com/gui/url/${btoa(trimmedText)}`;
            // Åbn et nyt vindue med søgningen
            window.open(url, '_blank');
        } else {
            // Hvis det er en IP-adresse eller andet, fortsæt som før
            const encodedText = encodeURIComponent(trimmedText);
            const url = `https://www.virustotal.com/gui/search/${encodedText}`;
            window.open(url, '_blank');
        }    
    } else {
        // Hvis der ikke er markeret tekst, så vis en advarsel
        alert("No text selected!");
    }
}