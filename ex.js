const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

// recognition grammar みたいなのって，これ作っといた方がいいっぽいな
// 語彙を決められるってこと？ならばかなり便利な気がするんだが
// 自分で文法（grammer）を定義するなんて，なんか作ったこともないコンパイラを作ってるみたいで楽しいね
// コンパイラという単語を出すと，os も作りたくなってしまうというのが男のサガたるものだ

const colors = [
    "aqua",
    "azure",
    "beige",
    "bisque",
    "black",
    "blue",
    "brown",
    "chocolate",
    "coral" /* … */,
];

const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
    " | ",
)};`;

// 使用されている文法形式は JSpeech Grammar Format (JSGF) です 
// — それについての詳細はリンク先の仕様書を参照してください。しかし、今のところは手っ取り早く実行してみましょう。

// まあこの grammar が何を表しているのかは全くわかってないんだが
// なんかのカラーコードを持ってくるように決めてるのかね

speechRecognitionList.addFromString(grammar, 1);


recognition.grammars = speechRecognitionList;
recognition.continuous = false
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


const diagnostic = document.querySelector(".output")
const bg = document.querySelector("html")
const hints = document.querySelector(".hints")

// 普通にテキストを出力するだけで十分なんだけど，このコードをどう改造したらいいのかがわからない
// とりあえずマイクをオンにしてそうな部分を探ってみるか

let colorHTML = "";
colors.forEach((color, i) => {
    console.log(color,i)
    colorHTML += `<span style=background-color:"${color};"> ${color} </span>`;
});
hints.innerHTML = `tap or click then say a color to change the background color of the app. Try ${colorHTML}.`

document.body.onclick = () =>{
    recognition.start();
    console.log("Ready to recieve a color command.")
}


recognition.onresult = (event)  =>  {
    const color = event.results[0][0].transcript;
    diagnostic.textContent = `Result recieved ${color}.`
    bg.style.backgroundColor = color;
    console.log(`Confidence: ${event.results[0][0].confidence}`);
}

// とりあえずオッケーでした
// 一言言わせてもらうと，おもしろすぎてやばいっす
// 字ましたと言わざるを得ない，
// 音声認識をやりたいという考え方もまあ存在している
// こういうのを，デモとか作らずに，ドキュメント見ながら最適な使い方をできてしまう人は本当にすごい
// それこそ，根っこの考え方をしっかり理解してるからそういうことができるのだろう
// エラー処理の方法も書いてるが，一旦パスでお願い（やべーやつ）
