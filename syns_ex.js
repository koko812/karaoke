// さてじゃあ中身も作っていいこうという話で
/*
    <form>
        <input type="text" class="txt" />
        <div>
            <!-- ここの，label は普通に p を使うのとどんな感じで使うのかがわからん -->
            <!-- ああでも，これ多分 label を使わないと，bar の真横に文字を出すのが無理なんだろうきっと -->
            <!-- ここの，for っていうのは初見だよね，# で参照するらしい -->
            <label for="rate">Rate</label>
            <input type="range" min="0.5" max="2" value="1" step="0.1" id="rate" />
            <!-- この辺りの命名規則がしっかりしててすごいと思う，後から使うことを想定するのは，最初から作るときは難しいとは思うんだけど -->
            <div class="rate-value">1</div>
            <div class="clearfix"></div>
        </div>
        <div>
            <label for="pitch">Rate</label>
            <!-- まあ，input type = range でスライドバーが出ることくらいは覚えとこうか -->
            <input type="range" min="0.5" max="2" value="1" step="0.1" id="rate" />
            <div class="rate-pitch">1</div>
            <div class="clearfix"></div>
        </div>
    </form>
    <!-- ここの，select も何をやってるのかなぞ，まあ後から選択肢を追加するんだとは思うんだけど -->

    <!-- だったらば，js から追加すりゃええやんって感じもしなくはないんだけどね --> <!-- というか，querySelector でコンポーネントを選ぶのは，上級者っぽいがかっこいいなと思った --> <!-- jQuery とか使い慣れてる人たちはもしかするのそっちの方が直感的，というか楽なのかもしれない --> <!-- まあ僕からすると，# や . の使い分けを覚えてないのであれなんだけど，今後覚えていく可能性はある --> <!-- とはいえ，react や next.js, tilewindCSS で使うなら覚えるかも，って雰囲気だけどね -->
    <select></select>
*/

// とりあえず，html を参考にしつつ埋めていくスタイルで

const synth = window.speechSynthesis;

const inputForm = document.querySelector('input')
const inputTxt = document.querySelector('.txt')
const voiceSelect = document.querySelector('select')

const rate = document.querySelector('#rate')
const rateValue = document.querySelector('.rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('.pitch-value')

let voices = []

// これも自分で作るってなると，いちいち写していくの面倒なので，
// この辺一気に取り込んでくる方法とかないのかなって感じはちょっとする
// react とかなら，直接 js のなかに html を書く感じだろうので，こういう面倒が生じないのかもしれない？
// だとすると，react/Next.js は最高だなと言わざるを得ない


// この後，option なるエレメントを作るらしいんだが，初仕様ですな
// あんまり html に詳しくなるつもりはないんだけど，まあ使っていったら勝手に覚えるよね多分
// とりあえず，^ の select 要素に色々追加していく感じらしい

function populateVoiceList() {
    console.log(inputForm)
    voices = synth.getVoices()
    // 配列の for は of で書くと覚えとこう
    // each とかもあったっけ？忘れちった，流石にこれを関数型で描くのはやりすぎだよな
    // ただでも，関数型言語ならばそうするんだろうな，なんか面白いな
    for (const voice of voices) {
        const option = document.createElement('option')
        option.textContent = `${voice.name} (${voice.lang})`
        console.log(voice.name);

        if (voice.default) {
            option.textContent += " -- DEFAULT";
        }

        // setAttribute が初見かもしれない
        // 今まで，element のスタイルをいじることはあったけど，attribute をいじることは流石になかった
        option.setAttribute("data-lang", voice.lang)
        option.setAttribute("data-name", voice.name)
        voiceSelect.appendChild(option);
    }
    // やってること自体は，いつも通り，container に div を追加していくのと変わりはない
}

populateVoiceList()
// ここまででは何も出て来なかったが．下に行を追加すると，見事に出てきた！
// さすが mdn と言わざるを得ない，何をやってるのかははっきりわかってないが
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList
}
// 説明
// この関数を実行するようになったら、以下のようにします。
// これは、 Firefox が voiceschanged イベントに対応しておらず、
// SpeechSynthesis.getVoices() が発行されると声のリストを返すだけになってしまうためです。
// しかし、 Chrome では、イベントが発行されるのを待ってからリストを作成する必要があるため、
// 下記のような if 文を記載しています。

// なんのことやらという感じだけどね，まあ気にするな

// こういうドキュメントページに書いてる説明文だけである程度コードが書けるようになってしまいたい
// 写経レベルを上げていきたいという話だよな


// 最後に inputForm とかを使っていくみたいなんだが，onsubmit とか onpause とかって，
// これ input 特有の属性なんだろうかという感じがちょっとしてる
console.log(inputForm);

// 地獄のようなデバッグ作業が終わった
// ともかく，ここを onchange -> submit にすること
// voice -> voice.name への修正
inputForm.onchange = (event) => {
    event.preventDefault();
    console.log(inputTxt.value)

    const utterThis = new SpeechSynthesisUtterance(inputTxt.value)
    // input 要素に書かれた内容は，どれの type であっても，value で取って来れるのだろうか
    // これさ，作った変数の一覧が見える機能とかないのかね，多分あると思うんだけど
    // 自分で考えながらプログラムを書いていこうと思うと，その辺も必要なような気がしていて

    // これは，voiceSelect が select 要素だから，selectedOptions が候補に出てきてるはず，賢いね
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    // alert(selectedOption)
    for (const voice of voices) {
        if (voice.name === selectedOption) {
            utterThis.voice = voice;
        }
    }
    utterThis.pitch = pitch.value
    utterThis.rate = rate.value

    synth.speak(utterThis)

    utterThis.onpause = (event) => {
        const char = event.utterance.text.charAt(event.charIndex)
    }
}
// なぜかこの状態だと音が出て来ないし，inputTxt の value もコンソールに流れて来なくて困っちゃうね

pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
    rateValue.textContent = rate.value;
};

// しかしながら，毎回フォームの内容がリセットされるのはやや面倒なので，
// そこはなんとか改善の余地があるかもしれない

// しかしながら，カラオケに入門する前の，めちゃくちゃいい準備運動になったはず，最高の 2h だったと思われ．
// お疲れ生です