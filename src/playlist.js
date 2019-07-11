function TrackDiv(data){
    let elem;

    function getElem(){
        if (!elem)
            render();
        return elem;
    }

    function render(){
        let track = document.createElement('div');
        track.className = "track";

        let audio = document.createElement('audio');
        const blob = new Blob([new Uint8Array(data.audioBlob[0].data).buffer]);
        audio.src = URL.createObjectURL(blob);
        audio.controls = "controls";
        let audioDiv = document.createElement('div');
        audioDiv.className = "audioDiv";
        audioDiv.appendChild(audio);

        let dateDiv = document.createElement('div');
        dateDiv.className = "time";
        dateDiv.innerText = new Date(data.timeStamp).toLocaleTimeString();
    
        let div = document.createElement('div');
        track.appendChild(div);
        div.appendChild(audioDiv);
        div.appendChild(dateDiv);
        elem = track;
    }

    this.getElem = getElem;
}

function init(){
    fetch('http://voicy-speaker.herokuapp.com/voices')
        .then(resp => resp.json()
        .then(data =>{
            const playlist_container = document.querySelector('[class*="playlist_container"]');
            playlist_container.innerHTML = "";
            for(let i = 0; i < data.length; i++){
                if(data[i].audioBlob[0] !== undefined && data[i].audioBlob[0].data.length != 0){                     
                    const trackDiv = new TrackDiv(data[i]);
                    playlist_container.appendChild(trackDiv.getElem());
                }
            }
            const playlist_footer = document.createElement("div");
            playlist_footer.id = 'playlist_footer';
            playlist_container.appendChild(playlist_footer);
        }))
}

export {init};