const fftSize = 8192;
const minFrequency = 100;
const maxFrequency = 900;

const width = 300;
const height = 300;

const init = async () => {
    // ここの一連が相当やばい
    // 一番下は，Bin の数ぶん，256段階の入れ物を用意するということ
    // frequencyBinCount がマジでなんのことなのかよくわからない
    const audioContext = new AudioContext();
    const sampleRate = audioContext.sampleRate;
    // 基本的に，値をそのまま返すやつは関数じゃないのかな，
    // その辺の設計思想がわかってないのでいつも悩んでしまう
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    const bufferSize = analyser.frequencyBinCount;
    const buffer = new Uint8Array(bufferSize);

    // stream をよくわからんけど，navigator のところから作る
    // navigator は他にどんな使用用途があるのだろう，って感じはちょっとある
    // で，なんか streamSource を stream から作って，それを analyzer へと繋げる
    // なんかよくわからんけど，美しい流れな感じがしていいね，stream 扱う感じが賢そう
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const input = audioContext.createMediaStreamSource(stream)
    input.connect(analyser)

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const minFrequencyIndex = Math.trunc(minFrequency / sampleRate * bufferSize)
    const maxFrequencyIndex = Math.trunc(maxFrequency / sampleRate * bufferSize)
    // SampleRate がなんぼくらいのものなのか，想像はついてないんだkど
    // なんか fftSize と混同してしまっていたので，そこはよくない，
    // fftSize はこのあとで使うはず？というか，ここでそれなりに min max を制限してるから，
    // それなりの細かさの分析ができるということだと思う

    const tick = () => {
        requestAnimationFrame(tick);
        analyser.getByteFrequencyData(buffer);
        // byte の周波数データを ^ で定義した，byte 列の buffer で受け取るという，
        // 至極当たり前な処理

        // ここから，最大点を求めるコードを書いていくんだが，
        // 微分してる側のグラフと，そのままのグラフ両方出てきてくれたら便利な気がするんだが，
        // canvas を二窓にするのは若干面倒なような気がしていて，ただ，
        // ほぼほぼクローンするみたいに書けたらそれは便利かな
        // というか普通にチェックボックスにすればいいのかという話もある気はするが
        const subbuffer = []
        for (let i = 0; i < bufferSize - 1; i++) {
            subbuffer[i] = buffer[i + 1] - buffer[i]
        }

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, width, height)

        let peakFlag = false;
        let peakIndex = 0;
        for (let i = minFrequencyIndex; i < maxFrequencyIndex; i++) {
            const h = buffer[i] / 256 * height;
            const sh = (subbuffer[i] / 256 + 0.5) * height
            // ここ，間違って，bufferSize って書いたけど，これは buffer の中のデカさの話なので，
            // uint8 に合わせて 256 にしましょうという話
            const x = (i - minFrequencyIndex) / (maxFrequencyIndex - minFrequencyIndex) * width;
            // ここも２項目を間違って，bufferSize としたが，多分 buffer の列から抜き出してるので，
            // min, max の幅にしないとダメだよという話
            if (!peakFlag && subbuffer[i] / 256 > 0.1) {
                peakFlag = true
            }
            if (peakFlag && !peakIndex && subbuffer[i] < 0 && buffer[i] / 256 > 0.4) {
                peakIndex = i
            }

            ctx.fillStyle = '#f00'
            if (peakIndex === i) {
                ctx.fillStyle = '#ff0' // 素晴らしくいい感じに出ています
            }
            ctx.fillRect(x, height - h, 2, h)
            //ctx.fillRect(x, height - sh, 2, sh) // まあみたかんじではたぶんおっけー

            // ここの heigth - h がかなり謎なんだがどういうことなんだろうか
            // height は下向きに伸びるので，これで正しいことは今納得した
            // width が 2 なのはテキトーなんだろうか，何段階で今回は出るの？幅的にね，周波数の分解能のこと
            // 256 は縦の段階なんで，横の段階がね，，，ごめんそれは今パッとはわからないや
            if (peakIndex) {
                const peakFrequency = peakIndex / bufferSize * sampleRate
                document.getElementById('frequency').textContent = `Frequency: ${peakFrequency} [Hz]`
                // ここから，音階の計算だが，マジでよくわかっていないくてやばい
                const ratio = Math.log(peakFrequency / 110) / Math.log(2);
                const toneIndex = Math.round(((ratio + 1000) % 1) * 12);
                const toneList = ['ラ','ラ#','シ','ド','ド#','レ','レ#','ミ','ファ','ファ#','ソ','ソ#','ラ',]
                document.getElementById('tone').textContent  = `tone:  ${toneList[toneIndex]}`
            }

        }
    }
    tick();
}

window.onload = () => {
    document.getElementById('start').onclick = () => {
        // ここしれっと onclick 使ってるけど，これ input button に無理やりつけてるってことか？
        // sinth たちとのつながりがちょっと気になる感じがする
        // 今確認したところ，あっちは onchange なるものを使ってた，まあ変わらんと言ってさしつかえねえか
        // 結局 onsubmit は使えずじまいだったな，それはちょっと残念
        // 基礎固め講座は今後も何回かやっていこうと思う
        init();
    }
}