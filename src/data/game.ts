import type { School } from "./schools";

// ============================================================
// 52分の1ゲーム ― 6年間の物語エンジン
// ============================================================

export type StatKey = "study" | "fitness" | "friend" | "charm" | "memory";

export type Stats = Record<StatKey, number>;

export const STAT_META: Record<StatKey, { label: string; icon: string; color: string }> = {
  study: { label: "学力", icon: "📚", color: "#3b82f6" },
  fitness: { label: "体力", icon: "💪", color: "#ef4444" },
  friend: { label: "なかよし", icon: "🤝", color: "#22c55e" },
  charm: { label: "きらめき", icon: "✨", color: "#a855f7" },
  memory: { label: "思い出", icon: "🌸", color: "#f59e0b" },
};

export const INITIAL_STATS: Stats = { study: 10, fitness: 10, friend: 10, charm: 10, memory: 10 };

export type Ctx = { school: School; playerName: string; rank: number };

export type ChoiceDef = {
  id: string;
  label: string;
  sub: string;
  effects: Partial<Stats>;
  result: string | ((ctx: Ctx) => string);
  correct?: boolean;
};

export type SceneDef = {
  id: string;
  grade: number; // 0=入学式 1..6 7=卒業
  season: string;
  title: string;
  icon: string;
  kind: "story" | "quiz" | "reflect";
  body: string | ((ctx: Ctx) => string);
  choices: ChoiceDef[];
  eliteOnly?: boolean;
};

export const resolve = (t: string | ((ctx: Ctx) => string), ctx: Ctx) =>
  typeof t === "function" ? t(ctx) : t;

// ---------------- 共通ストーリー ----------------

export const COMMON_SCENES: SceneDef[] = [
  {
    id: "entrance",
    grade: 0,
    season: "4月・入学式",
    title: "桜舞う入学式",
    icon: "🌸",
    kind: "story",
    body: (c) =>
      `4月8日、桜吹雪のなか、あなたは${c.school.name}の1年生になった。校門では6年生のお兄さんお姉さんが「おめでとう！」と手を振っている。ピカピカのランドセル、少し大きな制服…じゃなかった、私服と校帽。${c.school.shortName}の児童数は${c.school.students2024}人（2024年度実数・52校中${c.rank}位）。今日から6年間、この学校の「52分の1」の物語が始まる。教室に入ると、担任の先生が黒板に大きく書いた。「${c.school.motto}」。さあ、最初の返事は？`,
    choices: [
      { id: "a", label: "「はーい！！」と元気いっぱいに返事", sub: "きらめき・なかよし⤴", effects: { charm: 6, friend: 4 }, result: (c) => `教室中が笑顔になった。隣の席の子が「げんきだね！」と話しかけてくれた。${c.school.shortName}の1日目から友達ゲット！` },
      { id: "b", label: "少し緊張しながら小さく「はい」", sub: "学力・思い出⤴", effects: { study: 4, memory: 5 }, result: "先生がやさしくうなずいてくれた。緊張しながらも、黒板の文字をノートに書き写した。その1ページが6年間の宝物になる。" },
      { id: "c", label: "ランドセルをぎゅっと抱きしめて観察", sub: "体力・思い出⤴", effects: { fitness: 3, memory: 6 }, result: "まずは教室の観察から。窓の外に見える校庭、掲示板の時間割……すべてが新鮮だ。観察力の高い1年生として先生の記憶に残った。" },
    ],
  },
  {
    id: "g1-kyushoku",
    grade: 1,
    season: "1年・5月",
    title: "はじめての給食",
    icon: "🍛",
    kind: "story",
    body: (c) =>
      `${c.school.shortName}の給食デビュー。今日のメニューはカレーライスと牛乳。配膳係の白衣は少し大きくて、袖を折ってがんばる。川口市の給食は「生きた教材」といわれ、栄養士さんが考えたバランス献立だ。クラスの人気者はすでにおかわりの列を狙っている。あなたはどうする？`,
    choices: [
      { id: "a", label: "おかわりの列にダッシュ！", sub: "体力⤴⤴", effects: { fitness: 8, friend: 2 }, result: "見事おかわり成功！カレー2杯で午後の授業も元気いっぱい。食欲番長としてクラスに名が広まった。" },
      { id: "b", label: "苦手な野菜にもチャレンジ", sub: "学力・体力⤴", effects: { study: 4, fitness: 5 }, result: "ピーマンをひと口、またひと口。全部食べられた瞬間、先生が大きく拍手してくれた。「好き嫌い克服記念日」として連絡帳に記録された。" },
      { id: "c", label: "配膳係に立候補する", sub: "なかよし・きらめき⤴", effects: { friend: 6, charm: 3 }, result: "大きなお玉でよそる配膳係デビュー。みんなに「ありがとう」と言われて、給食の時間が待ち遠しくなった。" },
    ],
  },
  {
    id: "g1-tsugakuro",
    grade: 1,
    season: "1年・6月",
    title: "通学路の大ぼうけん",
    icon: "🎒",
    kind: "story",
    body: (c) =>
      `${c.school.address}にある${c.school.shortName}。最寄りは${c.school.station}（徒歩約${c.school.walkMin}分）。登校班のお兄さんに手を引かれ、通学路を歩く毎日。見守り隊のおじいちゃんが毎朝「いってらっしゃい！」と声をかけてくれる。今日は帰り道で小さな発見があった。通学路の途中で寄り道したくなる場所といえば？`,
    choices: [
      { id: "a", label: "校区の名物グルメに心を奪われる", sub: "思い出⤴⤴", effects: { memory: 8, charm: 2 }, result: (c) => `放課後の楽しみができた。${c.school.gourmet}――${c.school.shortName}っ子の合言葉だ。お小遣い帳をつけ始めた。` },
      { id: "b", label: "通学路の危険マップを作る", sub: "学力・なかよし⤴", effects: { study: 6, friend: 4 }, result: "曲がり角、用水、駐車場の出入り口……地図に赤丸をつけていく。先生に褒められ、クラスの安全ポスターに採用された。" },
      { id: "c", label: "ダンゴムシとザリガニの観察に没頭", sub: "体力・きらめき⤴", effects: { fitness: 4, charm: 5 }, result: "用水沿いでダンゴムシ100匹を数えた。自然観察の才能が開花し、生活科の発表で拍手喝采を浴びた。" },
    ],
  },
  {
    id: "g1-undokai",
    grade: 1,
    season: "1年・10月",
    title: "はじめての運動会",
    icon: "🏃",
    kind: "story",
    body: (c) =>
      `1年生のはじめての運動会。${c.school.shortName}の校庭に全校${c.school.students2024}人の声援が響く。1年生の種目は「かけっこ」と「ダンス玉入れ」。お弁当は家族とシートを広げて……運動会のお弁当の唐揚げは、なぜかいつもの3倍おいしい。開会式、あなたは緊張で足が震えている。`,
    choices: [
      { id: "a", label: "かけっこで1位を狙う！", sub: "体力⤴⤴", effects: { fitness: 9, charm: 2 }, result: "ヨーイドン！風を切って走った。結果はどうあれ、全力疾走の姿に家族が涙した。徒競走の才能が開花。" },
      { id: "b", label: "ダンスをノリノリで踊る", sub: "きらめき・なかよし⤴", effects: { charm: 7, friend: 4 }, result: "音楽に合わせて満面の笑みでダンス。保護者席から「かわいい！」の声が飛んだ。表現力の星、誕生。" },
      { id: "c", label: "応援団として声をからす", sub: "なかよし・思い出⤴", effects: { friend: 7, memory: 4 }, result: "赤組・白組の大応援団。声がかれるまで応援して、6年生に「来年は応援団長だな」と頭をなでられた。" },
    ],
  },
  {
    id: "g1-reflect",
    grade: 1,
    season: "1年・3月",
    title: "ひと息 ― 1年生のあなたへ",
    icon: "💭",
    kind: "reflect",
    body: (c) =>
      `1年生が終わろうとしている。ランドセルの肩ひもは少しゆるくなり、漢字もカタカナも書けるようになった。${c.school.shortName}での最初の1年。連絡帳の最後のページに、先生が赤ペンで書いてくれた。「よくがんばりました」。さて、あなたが一番心に残っているのは？`,
    choices: [
      { id: "a", label: "友達と遊んだ毎日", sub: "思い出・なかよし⤴", effects: { memory: 6, friend: 5 }, result: "友達の名前をノートいっぱいに書いた。1年生でできた友達は、6年生になっても宝物だ。" },
      { id: "b", label: "できるようになった勉強", sub: "学力・きらめき⤴", effects: { study: 6, charm: 4 }, result: "ひらがな、たしざん、九九の予習……「できた！」の積み重ねが自信になった。" },
      { id: "c", label: "運動会と給食の味", sub: "体力・思い出⤴", effects: { fitness: 5, memory: 6 }, result: "走った校庭と、カレーの味。体で覚えた1年生の記憶は、ずっと消えない。" },
    ],
  },
  {
    id: "g2-kuku",
    grade: 2,
    season: "2年・9月",
    title: "九九との戦い",
    icon: "✏️",
    kind: "story",
    body: (c) =>
      `2年生最大の関門、九九。${c.school.shortName}では「九九マスター検定」が行われ、合格すると教室の後ろに名前が貼り出される。お風呂で「にいちがに、ににんがし……」と唱える毎日。九九カードの端はボロボロだ。検定当日、先生の前で一人ずつ発表する。あなたの作戦は？`,
    choices: [
      { id: "a", label: "毎朝5分の特訓で完全暗記", sub: "学力⤴⤴", effects: { study: 9, charm: 1 }, result: "九九マスター検定、一発合格！教室の後ろに名前が輝いた。努力は裏切らないことを学んだ2年生の秋。" },
      { id: "b", label: "友達と問題を出し合う", sub: "学力・なかよし⤴", effects: { study: 6, friend: 5 }, result: "休み時間は九九クイズ大会。友達と教え合ううちに、苦手な七の段もスラスラに。勉強は一人じゃない。" },
      { id: "c", label: "九九の歌を作って覚える", sub: "きらめき・学力⤴", effects: { charm: 6, study: 5 }, result: "九九ラップを自作してクラスで披露。大ウケして、九九が楽しいものに変わった。${c.school.shortName}の九九ラッパー誕生。" },
    ],
  },
  {
    id: "g2-tanken",
    grade: 2,
    season: "2年・10月",
    title: "校区たんけん",
    icon: "🔍",
    kind: "story",
    body: (c) =>
      `生活科「わたしの町はっけん」。${c.school.area}の校区をグループで歩く。${c.school.features[1] ?? c.school.features[0]}――地図を片手に、消防署、郵便局、お店屋さんをめぐる。インタビューのメモは宝の山。校区の人に「${c.school.shortName}の子だね、がんばってね」と声をかけられた。`,
    choices: [
      { id: "a", label: "商店街の店主にインタビュー", sub: "なかよし・思い出⤴", effects: { friend: 6, memory: 5 }, result: (c) => `「この店は40年やってるよ」と店主さん。校区の歴史を聞き出し、発表会で拍手を浴びた。${c.school.gourmet}の味も再確認。` },
      { id: "b", label: "地図マスターとして道案内", sub: "学力・きらめき⤴", effects: { study: 6, charm: 4 }, result: "地図を読み、グループを迷わず案内。「○○がいると安心」と頼られる存在に。方向感覚が磨かれた。" },
      { id: "c", label: "見つけた生き物をスケッチ", sub: "体力・思い出⤴", effects: { fitness: 4, memory: 6 }, result: "用水のザリガニ、公園のセミの抜け殻……スケッチブックが校区の図鑑になった。観察眼に先生も驚いた。" },
    ],
  },
  {
    id: "g2-pool",
    grade: 2,
    season: "2年・7月",
    title: "夏のプール開き",
    icon: "🏊",
    kind: "story",
    body: (c) =>
      `梅雨が明け、${c.school.shortName}のプール開き。水温・気温の条件をクリアして、待望の初泳ぎだ。シャワーの冷たさに「キャー！」と叫び、バタ足の水しぶきが虹を作る。2年生の目標は「けのび」と「バタ足で5メートル」。プールサイドには先生の笛と、監視の保護者の目がある。`,
    choices: [
      { id: "a", label: "バタ足特訓で5メートル完泳", sub: "体力⤴⤴", effects: { fitness: 9, study: 1 }, result: "バタ足で5メートル、見事完泳！プールカードに花丸がついた。夏休みの市民プールが楽しみで仕方ない。" },
      { id: "b", label: "水が苦手な友達と一緒に練習", sub: "なかよし・体力⤴", effects: { friend: 7, fitness: 4 }, result: "手をつないで一緒にバタ足。友達が初めて顔をつけられた瞬間、二人で大喜びした。友情が深まった夏。" },
      { id: "c", label: "水中じゃんけん大会を主催", sub: "きらめき・思い出⤴", effects: { charm: 6, memory: 5 }, result: "自由時間に水中じゃんけん大会を開催。学年を超えた参加者で大盛り上がり。夏の思い出の1ページ。" },
    ],
  },
  {
    id: "g2-marathon",
    grade: 2,
    season: "2年・12月",
    title: "持久走大会",
    icon: "🏅",
    kind: "story",
    body: (c) =>
      `冬の名物、持久走大会。${c.school.shortName}の2年生は校庭とその周辺の約800メートルを走る。朝マラソンの成果を出す日だ。沿道には保護者と地域の人が並び、「がんばれー！」の声が飛ぶ。スタート直後は元気いっぱい、でも中盤で息が上がってきた……。`,
    choices: [
      { id: "a", label: "ラストスパートで順位を上げる", sub: "体力⤴⤴", effects: { fitness: 9, charm: 2 }, result: "残り100メートルで3人抜き！ゴール後の達成感は格別だった。努力の分だけ足が動くことを知った。" },
      { id: "b", label: "自分のペースで完走を目指す", sub: "体力・学力⤴", effects: { fitness: 6, study: 4 }, result: "ペース配分を考えて完走。去年よりタイムが縮まった。自分との戦いに勝った持久走だった。" },
      { id: "c", label: "走り終わって友達を応援", sub: "なかよし・思い出⤴", effects: { friend: 7, memory: 4 }, result: "ゴール後、まだ走る友達を沿道で応援。「ありがとう、がんばれた」と言われて心が温かくなった。" },
    ],
  },
  {
    id: "g3-quiz1",
    grade: 3,
    season: "3年・6月",
    title: "川口クイズ① ― 鋳物の町",
    icon: "🧪",
    kind: "quiz",
    body: (c) =>
      `3年生の社会科は「わたしたちの川口市」。担任の先生が出した川口クイズにクラスが沸いた。第1問――「川口市が全国に誇る伝統産業は、次のうちどれ？ヒント：キュポラ、緑のトラック、${c.school.area}の工場の煙突」`,
    choices: [
      { id: "a", label: "鋳物（いもの）", sub: "キュポラの火が目印", effects: { study: 8, memory: 3 }, correct: true, result: "正解！川口の鋳物は江戸時代から続く伝統産業。キュポラの火と、緑の集塵トラックは川口の風景だ。社会科見学で本物の工場を見る約束をした。" },
      { id: "b", label: "ガラス細工", sub: "キラキラ系？", effects: { study: 2, charm: 2 }, result: "残念！ガラスもきれいだけど、川口といえば鋳物。キュポラの見学でリベンジを誓った。" },
      { id: "c", label: "おせんべい", sub: "香ばしい系？", effects: { study: 2, friend: 2 }, result: "残念！せんべいは草加の名物。川口は鋳物の町。でも給食のせんべいはおいしかった。" },
    ],
  },
  {
    id: "g3-syakai",
    grade: 3,
    season: "3年・10月",
    title: "社会科見学の大冒険",
    icon: "🚌",
    kind: "story",
    body: (c) =>
      `3年生の社会科見学。${c.school.area}の${c.school.shortName}っ子は、バスに乗って市内の施設をめぐる。見学先は学校によって違う――グリーンセンター、SKIPシティ、鋳物工場、消防署、リサイクルプラザ……。しおりには「めあて」と「インタビューしたいこと」がびっしり。バスの席はくじ引きで決まった。`,
    choices: [
      { id: "a", label: "施設の人に積極質問！", sub: "学力・きらめき⤴", effects: { study: 7, charm: 4 }, result: "「1日に何個作るんですか？」「一番大変なことは？」質問攻めで施設の人が笑った。見学レポートは学年代表に選ばれた。" },
      { id: "b", label: "バスレク係として盛り上げる", sub: "なかよし・きらめき⤴", effects: { friend: 7, charm: 4 }, result: "バスの中でクイズ大会を開催。往復の車内は大盛り上がりで、運転手さんにも感謝された。クラスのムードメーカー確定。" },
      { id: "c", label: "スケッチとメモを完璧に取る", sub: "学力・思い出⤴", effects: { study: 6, memory: 5 }, result: "見学メモは図解つきの力作。スケッチブックは社会科の資料集のようになった。記録魔としての才能が開花。" },
    ],
  },
  {
    id: "g3-class",
    grade: 3,
    season: "3年・4月",
    title: "クラス替えと新しい風",
    icon: "👫",
    kind: "story",
    body: (c) =>
      `3年生、新しいクラス発表。${c.school.shortName}の昇降口に貼り出された名簿の前は黒山の人だかり。「やった、同じクラス！」「えー、離れちゃった……」悲喜こもごもの朝。新しい担任、新しい隣の席、新しい係。3年生からは理科と社会と書写と外国語活動が本格化する。ドキドキの新学期、あなたの第一歩は？`,
    choices: [
      { id: "a", label: "隣の席の子に自分から話しかける", sub: "なかよし⤴⤴", effects: { friend: 9, charm: 2 }, result: "「よろしくね！」の一言から始まった友情。その子とは6年生までずっと仲良しになった。勇気の一言の物語。" },
      { id: "b", label: "学級委員に立候補する", sub: "きらめき・学力⤴", effects: { charm: 7, study: 4 }, result: "立候補演説で「楽しいクラスにします！」と宣言。見事当選して、クラスのまとめ役に。リーダーの第一歩。" },
      { id: "c", label: "新しい教科の予習を始める", sub: "学力⤴⤴", effects: { study: 9, memory: 1 }, result: "理科の図鑑と地図帳を読み込む日々。3年生の授業が待ち遠しくなった。知的好奇心がぐんぐん伸びる。" },
    ],
  },
  {
    id: "g3-reflect",
    grade: 3,
    season: "3年・3月",
    title: "ひと息 ― 折り返しの3年生",
    icon: "💭",
    kind: "reflect",
    body: (c) =>
      `3年生が終わる。小学校6年間のちょうど折り返し地点だ。${c.school.shortName}での3年間で、あなたは九九もリコーダーも自転車の練習も乗り越えてきた。4年生からは委員会とクラブが始まる。高学年の仲間入りまで、あと1年。今の気持ちを、未来の自分への手紙に書くとしたら？`,
    choices: [
      { id: "a", label: "「4年生ではリーダーになりたい」", sub: "きらめき・学力⤴", effects: { charm: 6, study: 4 }, result: "未来の自分への手紙をタイムカプセルに。4年生での活躍を誓った。その手紙は卒業式の日に開封される。" },
      { id: "b", label: "「友達をもっと増やしたい」", sub: "なかよし・思い出⤴", effects: { friend: 6, memory: 5 }, result: "友達の輪を広げる決意を書いた。他クラスの子とも遊ぶ約束をした。4年生の楽しみが増えた。" },
      { id: "c", label: "「苦手なことにも挑戦したい」", sub: "体力・学力⤴", effects: { fitness: 5, study: 5 }, result: "苦手な跳び箱と漢字への挑戦を宣言。手紙を読み返した卒業の日、成長を実感することになる。" },
    ],
  },
  {
    id: "g4-iinkai",
    grade: 4,
    season: "4年・5月",
    title: "委員会デビュー",
    icon: "📋",
    kind: "story",
    body: (c) =>
      `4年生から始まる委員会活動。${c.school.shortName}には運動・放送・図書・飼育・栽培・美化・給食・保健・集会などの委員会がある。昼休みをつぶして働くこともあるけれど、全校のために働く誇りがある。希望調査の紙が配られた。どの委員会を選ぶ？`,
    choices: [
      { id: "a", label: "放送委員会で昼の放送DJ", sub: "きらめき⤴⤴", effects: { charm: 9, friend: 2 }, result: "「お昼の放送を始めます♪」マイクの前で緊張したけれど、全校が聴いてくれる快感は格別。放送の声が学校中に響いた。" },
      { id: "b", label: "運動委員会で用具の管理", sub: "体力・なかよし⤴", effects: { fitness: 7, friend: 4 }, result: "ボールや跳び箱の管理、朝マラソンの準備。縁の下の力持ちとして全校の運動を支えた。体力も責任感もアップ。" },
      { id: "c", label: "図書委員会で読み聞かせ", sub: "学力・思い出⤴", effects: { study: 7, memory: 4 }, result: "低学年への読み聞かせボランティア。1年生が目を輝かせて聴いてくれた。本の世界がもっと好きになった。" },
    ],
  },
  {
    id: "g4-rinkan",
    grade: 4,
    season: "4年・7月",
    title: "宿泊学習への第一歩",
    icon: "🏕️",
    kind: "story",
    body: (c) =>
      `4年生は宿泊学習の準備学年。${c.school.shortName}の5年生は福島・舘岩での「自然の教室」が待っている。その予行として、4年生は市内の施設でのデイキャンプや防災学習がある。飯ごう炊さんの練習では、火起こしに全員が苦戦。煙で涙目になりながらも、カレーの匂いに元気が出る。`,
    choices: [
      { id: "a", label: "火起こし係として奮闘", sub: "体力・きらめき⤴", effects: { fitness: 7, charm: 4 }, result: "うちわで扇ぎ続け、ついに火がついた！班のヒーローとして讃えられた。飯ごうのご飯は少しおこげ味。それも思い出。" },
      { id: "b", label: "班長として班をまとめる", sub: "なかよし・きらめき⤴", effects: { friend: 7, charm: 4 }, result: "役割分担と声かけで班をリード。先生に「5年生の自然の教室が楽しみだね」と言われた。リーダー力が開花。" },
      { id: "c", label: "自然観察の記録係", sub: "学力・思い出⤴", effects: { study: 7, memory: 4 }, result: "見つけた虫や植物をスケッチとメモで記録。観察ノートは学年のお手本になった。自然博士への道。" },
    ],
  },
  {
    id: "g4-quiz2",
    grade: 4,
    season: "4年・11月",
    title: "川口クイズ② ― 安行植木",
    icon: "🌳",
    kind: "quiz",
    body: (c) =>
      `4年生の社会科は「地域の発展」。先生からの川口クイズ第2問――「川口市安行地区が全国に誇る特産品は、次のうちどれ？ヒント：${c.school.area}の畑、グリーンセンター、密蔵院の桜」`,
    choices: [
      { id: "a", label: "植木・苗木", sub: "安行植木の里", effects: { study: 8, memory: 3 }, correct: true, result: "正解！安行植木は江戸時代からの伝統産業で、全国シェアはトップクラス。安行桜や植木まつりは川口の春の風物詩だ。" },
      { id: "b", label: "お茶", sub: "狭山茶はお隣", effects: { study: 2, charm: 2 }, result: "残念！お茶は狭山（所沢・入間）の名物。川口の安行といえば植木！グリーンセンターで確かめよう。" },
      { id: "c", label: "うなぎ", sub: "浦和の名物", effects: { study: 2, friend: 2 }, result: "残念！うなぎは浦和の名物。川口・安行といえば植木の里。密蔵院の安行桜を見に行こう。" },
    ],
  },
  {
    id: "g4-ongakukai",
    grade: 4,
    season: "4年・12月",
    title: "音楽会のステージ",
    icon: "🎵",
    kind: "story",
    body: (c) =>
      `${c.school.shortName}の音楽会。4年生は合唱と合奏の二刀流に挑戦する。練習は毎朝の朝学習と昼休み。リコーダーの音がそろい始めたときの感動、パートごとに分かれた合唱が重なったときの鳥肌。ステージ当日、体育館は保護者でいっぱいだ。`,
    choices: [
      { id: "a", label: "合奏の中心パートを担当", sub: "きらめき・学力⤴", effects: { charm: 7, study: 4 }, result: "緊張のソロパート、見事に成功！体育館に拍手が響いた。音楽の楽しさに目覚めた冬。" },
      { id: "b", label: "合唱を心を込めて歌う", sub: "なかよし・思い出⤴", effects: { friend: 6, memory: 5 }, result: "クラス全員の声がひとつになった瞬間、指揮の先生が涙ぐんだ。一生忘れないハーモニー。" },
      { id: "c", label: "舞台裏の進行係を務める", sub: "学力・なかよし⤴", effects: { study: 5, friend: 6 }, result: "幕開け・照明・椅子並べ。裏方の仕事を完璧にこなした。「君がいたから成功した」と先生に言われた。" },
    ],
  },
  {
    id: "g5-leader",
    grade: 5,
    season: "5年・4月",
    title: "高学年の自覚",
    icon: "🌟",
    kind: "story",
    body: (c) =>
      `5年生、高学年の仲間入り。${c.school.shortName}では5年生から委員会の中心になり、1年生のお世話も始まる。朝の登校班では班長を務め、運動会では応援団の幹部候補だ。「6年生になったら最高学年」という意識が芽生える。最初の全校朝会で、校長先生が言った。「5年生は学校の柱です」。`,
    choices: [
      { id: "a", label: "1年生のお世話係に立候補", sub: "なかよし・思い出⤴", effects: { friend: 8, memory: 4 }, result: "入学したばかりの1年生に校歌を教え、給食の配膳を手伝った。「お兄ちゃん・お姉ちゃん」と慕われる存在に。" },
      { id: "b", label: "応援団の幹部を目指す", sub: "きらめき・体力⤴", effects: { charm: 7, fitness: 5 }, result: "昼休みに声出し練習。応援団幹部として全校をまとめる姿に、下級生の憧れの的になった。" },
      { id: "c", label: "学習リーダーとして家庭学習を極める", sub: "学力⤴⤴", effects: { study: 9, charm: 2 }, result: "自学ノートは毎日2ページ。クラスメイトに勉強を教えることも増えた。頼れる学習リーダーとして認められた。" },
    ],
  },
  {
    id: "g5-shukuhaku",
    grade: 5,
    season: "5年・9月",
    title: "舘岩 自然の教室",
    icon: "⛰️",
    kind: "story",
    body: (c) =>
      `5年生最大のイベント、福島・舘岩での「自然の教室」（2泊3日）。${c.school.shortName}の5年生全員でバスに乗り、川口を離れての大冒険だ。尾瀬の自然、星空観察、キャンプファイヤー、飯ごう炊さん……。親元を離れての3日間に、不安と期待が入り混じる。出発の朝、川口駅前の集合場所は大混雑だった。`,
    choices: [
      { id: "a", label: "尾瀬ハイキングで自然博士に", sub: "学力・体力⤴", effects: { study: 7, fitness: 6 }, result: "尾瀬の湿原で水芭蕉と出会い、ガイドさんの話にメモを取った。自然観察レポートは学年一の力作に。" },
      { id: "b", label: "キャンプファイヤーで主役に", sub: "きらめき・なかよし⤴", effects: { charm: 8, friend: 5 }, result: "キャンプファイヤーのスタンツで主役を務めた。炎を囲んで歌った「今日の日はさようなら」は一生の思い出。" },
      { id: "c", label: "部屋長としてみんなを支える", sub: "なかよし・思い出⤴", effects: { friend: 8, memory: 5 }, result: "ホームシックの友達を励まし、部屋をまとめた。3日間でクラス全員が家族のようになった。絆の宿泊学習。" },
    ],
  },
  {
    id: "g5-jiman",
    grade: 5,
    season: "5年・11月",
    title: "学校自慢フェスティバル",
    icon: "🎊",
    kind: "story",
    body: (c) =>
      `${c.school.shortName}の特色を全校で祝う「${c.school.annualEvents[0]}」の季節がやってきた。${c.school.features[0]}――地域の人も見に来る一大イベントだ。5年生は出店と発表の中心として、企画から運営まで担う。あなたの班の企画は？`,
    choices: [
      { id: "a", label: "学校自慢テーマの研究発表", sub: "学力・きらめき⤴", effects: { study: 7, charm: 5 }, result: (c) => `「${c.school.features[0]}」の調べ学習の集大成を発表した。地域の人から「よく調べたね」と褒められた。${c.school.shortName}への愛が深まった。` },
      { id: "b", label: "模擬店の店長として奮闘", sub: "なかよし・体力⤴", effects: { friend: 7, fitness: 5 }, result: "模擬店は長蛇の列！接客と調理で大忙しだったけれど、完売の瞬間の喜びは格別だった。" },
      { id: "c", label: "ステージ発表で観客を魅了", sub: "きらめき・思い出⤴", effects: { charm: 8, memory: 4 }, result: "ステージ発表で会場を沸かせた。地域のおじいちゃんおばあちゃんが涙を流して喜んでくれた。" },
    ],
  },
  {
    id: "g5-reflect",
    grade: 5,
    season: "5年・3月",
    title: "ひと息 ― 最高学年を前に",
    icon: "💭",
    kind: "reflect",
    body: (c) =>
      `5年生が終わる。あと1年で卒業だ。${c.school.shortName}の6年生が卒業式で歌う姿を見て、「来年は自分たちの番だ」と実感した。在校生代表の言葉を述べた5年生の先輩の姿が目に焼き付いている。最高学年になるあなたへ、今の決意は？`,
    choices: [
      { id: "a", label: "「最高の6年生になる」", sub: "きらめき・なかよし⤴", effects: { charm: 6, friend: 5 }, result: "卒業する6年生に「来年は任せて！」と宣言した。その言葉を胸に、最高学年の1年が始まる。" },
      { id: "b", label: "「苦手を克服する1年にする」", sub: "学力・体力⤴", effects: { study: 6, fitness: 5 }, result: "苦手な教科と運動の克服を誓った。6年生の自分への手紙に目標を書いて、机の引き出しにしまった。" },
      { id: "c", label: "「思い出をたくさん作る」", sub: "思い出⤴⤴", effects: { memory: 9, friend: 3 }, result: "残り1年の思い出づくりを誓った。カメラ係に立候補して、クラスの日常を撮りためることにした。" },
    ],
  },
  {
    id: "g6-shugaku",
    grade: 6,
    season: "6年・6月",
    title: "修学旅行 ― 日光",
    icon: "🚌",
    kind: "story",
    body: (c) =>
      `6年生最大のイベント、修学旅行。川口市の小学校の定番は世界遺産・日光だ。東照宮の陽明門、三猿・眠り猫、華厳の滝、中禅寺湖、戦場ヶ原ハイキング……。${c.school.shortName}の6年生全員で1泊2日の旅に出る。夜の宿では、布団の中で secret トークが止まらない。お小遣いで買うお土産は何にする？`,
    choices: [
      { id: "a", label: "東照宮の歴史を極める", sub: "学力・思い出⤴", effects: { study: 8, memory: 5 }, result: "陽明門の彫刻、三猿の意味……ガイドさんの話をメモして、歴史博士に。修学旅行記は学年代表作に選ばれた。" },
      { id: "b", label: "華厳の滝と戦場ヶ原を満喫", sub: "体力・思い出⤴", effects: { fitness: 8, memory: 5 }, result: "華厳の滝の迫力に絶叫し、戦場ヶ原を完歩した。自然の大きさに触れた2日間。足の筋肉痛も勲章だ。" },
      { id: "c", label: "夜の学級レクをプロデュース", sub: "きらめき・なかよし⤴", effects: { charm: 8, friend: 6 }, result: "宿の夜のレクリエーションを仕切って大成功。先生も巻き込んだ出し物で、6年生全員が腹を抱えて笑った。" },
    ],
  },
  {
    id: "g6-bunshu",
    grade: 6,
    season: "6年・1月",
    title: "卒業文集と将来の夢",
    icon: "📖",
    kind: "story",
    body: (c) =>
      `卒業文集の季節。「将来の夢」の作文を書く。${c.school.shortName}での6年間を振り返りながら、原稿用紙に向き合う。${c.school.juniorHigh}への進学も決まり、中学生になる実感が湧いてきた。将来の夢、何を書く？`,
    choices: [
      { id: "a", label: "勉強を生かす夢（研究者・先生・医師…）", sub: "学力・きらめき⤴", effects: { study: 8, charm: 4 }, result: "6年間の学びを胸に、大きな夢を書いた。文集のタイトルは「未来への一歩」。先生が目を細めて読んでくれた。" },
      { id: "b", label: "スポーツの夢（選手・コーチ…）", sub: "体力・きらめき⤴", effects: { fitness: 8, charm: 4 }, result: "運動会と持久走の思い出とともに、アスリートの夢を書いた。文集の寄せ書きには友達からのエールがびっしり。" },
      { id: "c", label: "みんなを笑顔にする夢", sub: "なかよし・思い出⤴", effects: { friend: 8, memory: 5 }, result: "友達との日々を思い出しながら、「みんなを笑顔にする仕事」の夢を書いた。読んだクラスの子が泣いてくれた。" },
    ],
  },
  {
    id: "g6-last",
    grade: 6,
    season: "6年・2月",
    title: "最後の校庭",
    icon: "🌇",
    kind: "story",
    body: (c) =>
      `卒業まで、あと1か月。${c.school.shortName}の校庭で遊べるのも、あと少しだ。放課後、6年生は校庭に集まって思い出づくりに励む。1年生のときに植えた朝顔の種は、もう何代目になっただろう。夕日の校庭で、あなたは何をする？`,
    choices: [
      { id: "a", label: "全員ドッジボール大会！", sub: "体力・なかよし⤴", effects: { fitness: 7, friend: 6 }, result: "6年生全員でのドッジボール大会。先生チームも参戦して大白熱。汗と笑いの一時限目、いや放課後だった。" },
      { id: "b", label: "校舎への感謝の手紙を書く", sub: "思い出・学力⤴", effects: { memory: 8, study: 4 }, result: "6年間お世話になった校舎への感謝の手紙を書いた。「ありがとう、校舎」の文字に、先生が涙した。" },
      { id: "c", label: "1年生と思い出の遊びをする", sub: "なかよし・思い出⤴", effects: { friend: 8, memory: 5 }, result: "1年生と手をつないで校庭を走った。5年前の自分を思い出して、少しだけ泣きそうになった。" },
    ],
  },
  {
    id: "graduation",
    grade: 7,
    season: "3月・卒業式",
    title: "卒業式 ― 旅立ちの日",
    icon: "🎓",
    kind: "story",
    body: (c) =>
      `3月25日、${c.school.name}・卒業式。体育館に「卒業生入場」の音楽が響く。6年間の思い出が走馬灯のように駆けめぐる。在校生の「送る言葉」、卒業生の「別れの言葉」、そして全員合唱。担任の先生が一人ひとりに卒業証書を手渡す。「${c.playerName}さん」。呼ばれたあなたの胸はいっぱいだ。${c.school.juniorHigh}への進学を控え、${c.school.shortName}での6年間が幕を閉じる。最後に、心の中で唱えた言葉は？`,
    choices: [
      { id: "a", label: "「ありがとう、みんな！」", sub: "最高の旅立ち", effects: { friend: 5, memory: 5, charm: 5 }, result: "涙と笑顔の卒業式。友達と肩を組んで校歌を歌った。6年間のすべてが宝物になった。" },
      { id: "b", label: "「中学校でもがんばるぞ！」", sub: "未来への決意", effects: { study: 5, fitness: 5, charm: 5 }, result: "卒業証書を胸に、中学校への決意を固めた。${c.school.shortName}で育んだ力は、中学校でも輝くはずだ。" },
    ],
  },
];

// ---------------- 並木エリート専用シーン ----------------

export const ELITE_SCENES: SceneDef[] = [
  {
    id: "e1-jishitsu",
    grade: 1,
    season: "1年・エリート",
    title: "✨ エリート自習室デビュー",
    icon: "👑",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `市内では珍しい並木小の「自習室」。放課後、静寂の自習室に選ばれた1年生が集められた。金色のプレートには「NAMIKI ELITE 自習室」の文字。司書の先生が言う。「ここは自分から学ぶ子のための特別な場所です」。エリートの第一歩、あなたは？`,
    choices: [
      { id: "a", label: "毎日30分のエリート自習を誓う", sub: "学力⤴⤴ エリート+1", effects: { study: 10, charm: 3 }, result: "エリート自習を継続し、漢字テストは常に満点。1年生にして自学の習慣を身につけたエリートっ子に。" },
      { id: "b", label: "友達を誘って自習室仲間を増やす", sub: "なかよし・学力⤴", effects: { friend: 7, study: 6 }, result: "自習室仲間が増えて、教え合いが始まった。エリートは独り占めしない。分かち合うのがNAMIKI流。" },
    ],
  },
  {
    id: "e2-kentei",
    grade: 2,
    season: "2年・エリート",
    title: "✨ NAMIKI検定ジュニア",
    icon: "🏆",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `県内では珍しい並木小の「独自検定」。2年生は「NAMIKI検定ジュニア（漢字・計算）」に挑戦する。合格者には金色の認定シールが贈られ、昇降口の「エリートボード」に名前が掲示される。全校の視線が集まるなか、検定の日が来た。`,
    choices: [
      { id: "a", label: "金色シールを目指して猛特訓", sub: "学力⤴⤴ エリート+1", effects: { study: 10, memory: 4 }, result: "見事合格！金色シールをランドセルに貼って登校した。エリートボードに名前が輝く快感は格別だった。" },
      { id: "b", label: "クラス全員合格を目指して教え合う", sub: "なかよし・学力⤴", effects: { friend: 8, study: 6 }, result: "クラス全員合格を掲げて放課後勉強会を主催。合格率学年No.1に。真のエリートは周りを引き上げる。" },
    ],
  },
  {
    id: "e3-band",
    grade: 3,
    season: "3年・エリート",
    title: "✨ ブラスバンドと白百合合唱団",
    icon: "🎺",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `並木小の誇り、ブラスバンドと白百合合唱団。地域イベントに引っ張りだこの芸術エリート集団だ。3年生から仮入部ができる。楽器体験会ではトランペットの音に痺れ、合唱体験では白百合のハーモニーに鳥肌が立った。放課後の特別な時間、あなたはどちらを選ぶ？`,
    choices: [
      { id: "a", label: "ブラスバンドでトランペットに挑戦", sub: "きらめき⤴⤴", effects: { charm: 10, fitness: 3 }, result: "唇が腫れるまで練習して、地域コンサートでデビュー。アンコールの拍手に涙した。芸術エリートの道。" },
      { id: "b", label: "白百合合唱団でソプラノを極める", sub: "きらめき・なかよし⤴", effects: { charm: 9, friend: 5 }, result: "白百合のハーモニーの一員としてステージに立った。会場のすすり泣きが聞こえた。歌声のエリート誕生。" },
    ],
  },
  {
    id: "e4-fureai",
    grade: 4,
    season: "4年・エリート",
    title: "✨ 三世代ふれあいリーダー",
    icon: "🤲",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `並木小名物「三世代ふれあい活動」。子ども・親・祖父母の三世代が学校に集い、昔遊びや給食交流をする地域エリートの伝統行事だ。4年生は運営リーダーとして企画に参加できる。町会長さんとの打ち合わせにも同席する本格派。あなたの企画は？`,
    choices: [
      { id: "a", label: "昔遊びマスターとして全校を指導", sub: "なかよし・思い出⤴", effects: { friend: 9, memory: 6 }, result: "お手玉・けん玉・あやとりの達人として全校を指導。おばあちゃんに「昔の○○ちゃんみたい」と抱きしめられた。" },
      { id: "b", label: "ふれあい給食の司会を務める", sub: "きらめき・なかよし⤴", effects: { charm: 9, friend: 5 }, result: "三世代200人の給食交流会の司会を務めた。「並木の子はしっかりしてるね」と町会長さんに褒められた。" },
    ],
  },
  {
    id: "e5-natsu",
    grade: 5,
    season: "5年・エリート",
    title: "✨ 夏の運動会エリート選抜リレー",
    icon: "🔥",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `市内では珍しい並木小の「夏の運動会」。照りつける太陽の下、体力づくり研究校の真骨頂が発揮される。5年生の目玉はエリート選抜リレー――各クラス代表によるガチンコ勝負だ。30年以上続く体力づくりの伝統を背負い、代表選考会が始まった。`,
    choices: [
      { id: "a", label: "代表に選ばれてアンカーを務める", sub: "体力⤴⤴ エリート+1", effects: { fitness: 11, charm: 4 }, result: "アンカーとして3人抜きの大逆転！夏の校庭に歓声が響いた。体力エリートの称号を手にした瞬間だった。" },
      { id: "b", label: "応援団長として全校を鼓舞する", sub: "きらめき・なかよし⤴", effects: { charm: 9, friend: 6 }, result: "応援団長として灼熱の応援合戦を制した。「並木の夏は熱い」の伝説に新たな1ページを刻んだ。" },
    ],
  },
  {
    id: "e6-nintei",
    grade: 6,
    season: "6年・エリート",
    title: "✨ エリート認定式",
    icon: "👑",
    kind: "story",
    eliteOnly: true,
    body: (c) =>
      `卒業を前に、並木小の最高栄誉「NAMIKI ELITE認定式」。6年間の学び・体力・芸術・地域貢献のすべてが評価され、選ばれた児童に金色の認定証が贈られる。校長先生が言う。「健康・勤勉・敬愛を体現したあなたたちこそ、川口の未来です」。認定式当日、あなたの胸は高鳴っている。`,
    choices: [
      { id: "a", label: "ゴールドエリートとして答辞を述べる", sub: "全ステータス⤴ 伝説へ", effects: { study: 6, fitness: 6, friend: 6, charm: 6, memory: 6 }, result: "代表答辞で6年間の感謝を述べた。会場はスタンディングオベーション。NAMIKI ELITEの名は後輩に語り継がれる。" },
      { id: "b", label: "仲間全員での認定を喜ぶ", sub: "なかよし・思い出⤴⤴", effects: { friend: 10, memory: 10 }, result: "クラス全員での認定が発表された。「みんなでエリート」の号令で肩を組んだ。並木史上初の全員認定の伝説が生まれた。" },
    ],
  },
];

// ---------------- エンディング ----------------

export type Ending = {
  id: string;
  title: string;
  icon: string;
  condition: (s: Stats, elite: boolean) => boolean;
  text: (ctx: Ctx) => string;
};

export const ENDINGS: Ending[] = [
  {
    id: "gold-elite",
    title: "👑 NAMIKIゴールドエリート",
    icon: "👑",
    condition: (s, elite) => elite && s.study + s.fitness + s.friend + s.charm + s.memory >= 260,
    text: (c) => `${c.playerName}さんは、並木小6年間のすべてを極めた「ゴールドエリート」として卒業した。学力・体力・芸術・地域貢献のすべてで金色の認定を受け、卒業式では全校の拍手に送られた。${c.school.juniorHigh}でも、そしてその先でも、NAMIKI ELITEの名は輝き続けるだろう。川口の未来をよろしく！`,
  },
  {
    id: "elite",
    title: "✨ NAMIKIエリート",
    icon: "✨",
    condition: (s, elite) => elite,
    text: (c) => `${c.playerName}さんは、校訓「健康・勤勉・敬愛」を体現した「NAMIKIエリート」として卒業。自習室・独自検定・ブラスバンド・三世代ふれあい・夏の運動会――並木ならではの6年間を駆け抜けた。${c.school.juniorHigh}での活躍も約束されたようなものだ。`,
  },
  {
    id: "allround",
    title: "🌈 オールラウンダーマスター",
    icon: "🌈",
    condition: (s) => s.study >= 45 && s.fitness >= 45 && s.friend >= 45 && s.charm >= 40 && s.memory >= 40,
    text: (c) => `${c.playerName}さんは、勉強も運動も友情もきらめきも、すべてを高めたオールラウンダーとして卒業。${c.school.shortName}の6年間で「できないことなどない」を証明した。${c.school.juniorHigh}でも、そのバランス感覚は無敵のはずだ。`,
  },
  {
    id: "study",
    title: "📚 学びの達人",
    icon: "📚",
    condition: (s) => s.study >= 55 && s.study >= s.fitness && s.study >= s.friend,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}の「学びの達人」として卒業。九九・漢字・社会科見学・川口クイズ……知的好奇心の塊として6年間を駆け抜けた。卒業文集の将来の夢は、きっと叶う。`,
  },
  {
    id: "sports",
    title: "🏅 スポーツスター",
    icon: "🏅",
    condition: (s) => s.fitness >= 55 && s.fitness >= s.study && s.fitness >= s.charm,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}の「スポーツスター」として卒業。運動会・持久走・プール・ドッジボール……校庭のヒーローだった6年間。その脚力と根性は、中学校の部活でも輝くはずだ。`,
  },
  {
    id: "friend",
    title: "☀️ 太陽のムードメーカー",
    icon: "☀️",
    condition: (s) => s.friend >= 55,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}の「太陽」として卒業。クラス替えも宿泊学習も、あなたがいれば大丈夫だった。卒業式で交わした寄せ書きの数は学年No.1。中学校でも、あなたの周りには笑顔が集まるだろう。`,
  },
  {
    id: "charm",
    title: "🎨 きらめきアーティスト",
    icon: "🎨",
    condition: (s) => s.charm >= 55,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}の「きらめきアーティスト」として卒業。音楽会・放送・ステージ発表……人を惹きつける才能が開花した6年間。その個性は、中学校でさらに磨かれるはずだ。`,
  },
  {
    id: "memory",
    title: "🌸 思い出コレクター",
    icon: "🌸",
    condition: (s) => s.memory >= 55,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}の「思い出コレクター」として卒業。通学路の四季、給食の味、友達の笑顔……6年間のすべてを心のアルバムに収めた。大人になっても、この6年間があなたを支えるだろう。`,
  },
  {
    id: "standard",
    title: "🎒 ${shortName}っ子マスター",
    icon: "🎒",
    condition: () => true,
    text: (c) => `${c.playerName}さんは、${c.school.shortName}での6年間を立派に卒業した。${c.school.students2024}人の仲間と過ごした日々、${c.school.motto}の心は、あなたの中にしっかり根付いた。${c.school.juniorHigh}での新しい物語へ、行ってらっしゃい！`,
  },
];

export function judgeEnding(stats: Stats, elite: boolean): Ending {
  return ENDINGS.find((e) => e.condition(stats, elite)) ?? ENDINGS[ENDINGS.length - 1];
}

export function buildScenes(school: School): SceneDef[] {
  const scenes = [...COMMON_SCENES];
  if (school.elite) {
    for (const e of ELITE_SCENES) {
      // 各学年の最後（reflect等の前）に挿入：grade一致の最後の共通シーンの直前に
      const idx = scenes.findIndex(
        (s) => s.grade === e.grade && (s.kind === "reflect" || s.id === "graduation")
      );
      // reflectが無い学年はそのgradeの最後に
      let insertAt = scenes.reduce(
        (acc, s, i) => (s.grade === e.grade ? i : acc),
        scenes.length - 1
      );
      if (idx !== -1) insertAt = idx;
      scenes.splice(insertAt, 0, e);
    }
  }
  return scenes.sort((a, b) => a.grade - b.grade || 0);
}

export function gradeLabel(grade: number): string {
  if (grade === 0) return "入学式";
  if (grade === 7) return "卒業式";
  return `${grade}年生`;
}
