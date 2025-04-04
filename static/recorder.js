//狀態變數
let stat = "idle";
let paused = false;
let stat_text = {"idle":"點擊以開始錄音", "running":"錄音中... ", "paused":"錄音暫停 ", "done": "錄音完成"};
//取得html DOM
let startBtn = document.querySelector("#startBtn");
let pauseBtn = document.querySelector("#pauseBtn");
let stopBtn = document.querySelector("#stopBtn");
let clearBtn = document.querySelector("#clearBtn");
let audioPlayer = document.querySelector("#audioPlayer");
let download = document.querySelector("#download");
//錄音需要變數
let chunk = [];
let recorder;

//開始button onclick
startBtn.addEventListener('click', async() => {
    //取得麥克風
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //從麥克風錄音
    recorder = new MediaRecorder(stream);
    //錄音處理設置
    chunk = []
    recorder.ondataavailable = (event)=>{
        chunk.push(event.data);
    };
    //錄音停止時的處理設置，傳送webm到後端轉為wav
    recorder.onstop = async()=>{
        let audioBlob = new Blob(chunk, {type: "audio/webm"});
        let formdata = new FormData();
        formdata.append("audio", audioBlob, "rec.webm");
        let response = await fetch("/convert", {
            method: "POST",
            body: formdata
        });
        let wav = await response.blob();
        //傳回前端提供下載
        let audioUrl = URL.createObjectURL(wav);
        audioPlayer.src = audioUrl;
        download.style.display = "block";
        download.href = audioUrl;
        download.download = "rec.wav";
    };
    //開始錄音
    recorder.start();
    //狀態切換
    stat = "running";
    document.querySelector("#status").innerHTML = stat_text[stat];
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    clearBtn.disabled = true;
});
//暫停
pauseBtn.addEventListener('click', function (){
    paused = !paused;
    if(paused){
        recorder.pause();
        pauseBtn.innerHTML = "繼續錄音";
        stat = "paused";
    }
    else{
        recorder.resume();
        pauseBtn.innerHTML = "暫停錄音";
        stat = "running";
    }
    document.querySelector("#status").innerHTML = stat_text[stat];
});
//停止
stopBtn.onclick = function (){
    recorder.stop();
    stat = "done";
    startBtn.disabled = false;
    clearBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    document.querySelector("#status").innerHTML = stat_text[stat];
}
//清除
clearBtn.addEventListener('click', () => {
    chunk = [];
    audioPlayer.src = "";
    download.style.display = "none";
    stat = "idle";
    document.querySelector("#status").innerHTML = stat_text[stat];
});

