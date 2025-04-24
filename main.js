const fftSize = 8192;

const init = async () => {
    // ここの一連が相当やばい
    // 一番下は，Bin の数ぶん，256段階の入れ物を用意するということ
    // frequencyBinCount がマジでなんのことなのかよくわからない
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize  = fftSize;
    const bufferSize = analyser.frequencyBinCount();
    const buffer = new Uint8Array(bufferSize);
    
    // stream をよくわからんけど，navigator のところから作る
    // navigator は他にどんな使用用途があるのだろう，って感じはちょっとある
    // で，なんか streamSource を stream から作って，それを analyzer へと繋げる
    // なんかよくわからんけど，美しい流れな感じがしていいね，stream 扱う感じが賢そう
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const input = audioContext.createMediaStreamSource(stream)
    input.connect(analyser)
    
}