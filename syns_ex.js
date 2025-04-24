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

    <!-- だったらば，js から追加すりゃええやんって感じもしなくはないんだけどね -->
    <!-- というか，querySelector でコンポーネントを選ぶのは，上級者っぽいがかっこいいなと思った -->
    <!-- jQuery とか使い慣れてる人たちはもしかするのそっちの方が直感的，というか楽なのかもしれない -->
    <!-- まあ僕からすると，# や . の使い分けを覚えてないのであれなんだけど，今後覚えていく可能性はある -->
    <!-- とはいえ，react や next.js, tilewindCSS で使うなら覚えるかも，って雰囲気だけどね -->
    <select></select>
*/

// とりあえず，html を参考にしつつ埋めていくスタイルで

const synth = window.speechSynthesis;

const inputForm = document.querySelector('input')
const inputText = document.querySelector('.txt')
const voiceSelect = document.querySelector('select')

const rate = document.querySelector('#rate')
const rateValue = document.querySelector('.rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('.pitch-value')

// これも自分で作るってなると，いちいち写していくの面倒なので，
// この辺一気に取り込んでくる方法とかないのかなって感じはちょっとする
// react とかなら，直接 js のなかに html を書く感じだろうので，こういう面倒が生じないのかもしれない？
// だとすると，react/Next.js は最高だなと言わざるを得ない


