'use strict';

/*
今回の予診票に特有の定数
  * 縦横のピクセル数
  * 予診票画像 questionnaire.png の DPI
  * 数字を一桁ずつ個別の入力枠に記入する箇所での、隣接する桁同士の x 座標の差
  * 適した出力フォント設定（組み合わせて連結するので最後にスペースを入れてある）
  * ダウンロードするファイルの名前（面倒なので固定）
*/
const Width = 1190, Height = 1683, DPI = 144,
      Diff_x_to_next_digit = 33,
      Font_size = '24px ', Ruby_font_size = '18px ', 
      Font_family = 'serif ', Digit_font_family = 'monospace ',
      Download_PNG_filename = 'filled_questionnaire.png';

/*
Canvas のコンテキストをあちこちの関数で使うので、受け渡しが面倒だから
大域変数を使う。
get_finished_questionnaire の中で他の関数を定義すれば大域変数にしなくても
済むが、なんとなくごちゃごちゃして見にくくなりそうな気がして嫌だな、
という理由もある。
*/
var ctx;


function get_finished_questionnaire() {
  //予診票の PNG 画像を背景に読み込んだキャンバスを用意する。
  const canv = document.createElement('canvas');
  canv.width = Width;
  canv.height = Height;
  document.getElementById('filled_questionnaire_container').appendChild(canv);
  ctx = canv.getContext('2d');
  const bg_img = new Image();
  bg_img.src = 'questionnaire.png';
  bg_img.onload = function() {
    ctx.drawImage(bg_img, 0, 0, Width, Height);
    write_filled_values();
    //ダウンロード
    canv.toBlob(function(blob) {
      const anchor = document.createElement('a');
      anchor.download = Download_PNG_filename;
      document.body.appendChild(anchor);
      const url = URL.createObjectURL(blob);
      anchor.href = url;
      anchor.click();
      URL.revokeObjectURL(url);
    });
  };
}

/*
フォームの入力内容を読み込み、予診票上の該当する位置に文字やレ点を書き出す。
*/
function write_filled_values() {
  const Q = document.questionnaire;

  const prefecture = selected_choice(Q.prefecture);
  write_str_on_img(prefecture.substring(0, prefecture.length - 1), 126, 182);
  switch (prefecture.charAt(prefecture.length - 1)) {
    case '都': write_circle(380, 158); break;
    case '道': write_circle(415, 158); break;
    case '府': write_circle(380, 182); break;
    case '県': write_circle(415, 182); break;
    default: break;
  }

  write_str_on_img(Q.municipality.value, 442, 182);
  switch (selected_radio_choice(Q.municipality_type)) {
    case '市': write_circle(684, 158); break;
    case '区': write_circle(720, 158); break;
    case '町': write_circle(684, 182); break;
    case '村': write_circle(720, 182); break;
    default: break;
  }

  write_str_on_img(Q.address.value, 126, 234);

  write_str_on_img(Q.name_kana.value, 126, 261, Font_family, Ruby_font_size);
  write_str_on_img(Q.name_kanji.value, 126, 309);

  write_str_on_img(Q.tel_1.value, 544, 269);
  write_str_on_img(Q.tel_2.value, 544, 309);
  write_str_on_img(Q.tel_3.value, 646, 309);

  write_digits(Q.birth_year.value.padStart(4, '0'), 129, 355);
  write_digits(Q.birth_month.value.padStart(2, '0'), 287, 355);
  write_digits(Q.birth_date.value.padStart(2, '0'), 377, 355);
  write_digits(Q.age.value.padStart(3, '0'), 524, 355);

  const sex = selected_radio_choice(Q.sex);
  if (sex == '男') { write_checkmark(677, 348); }
  if (sex == '女') { write_checkmark(749, 348); }

  const temperature = Q.temperature.value;
  write_str_on_img(temperature[0], 967, 355, Digit_font_family);
  write_str_on_img(temperature[1], 1000, 355, Digit_font_family);
  write_str_on_img(temperature[3] || '0', 1081, 355, Digit_font_family);

  write_YN_checkmark('Q1', 436);
  write_month_and_date('Q1_1st_jab_date', 424, 497, 452);
  write_month_and_date('Q1_2nd_jab_date', 663, 740, 452);

  write_YN_checkmark('Q2', 484);

  write_YN_checkmark('Q3', 524);

  write_YN_checkmark('Q4', 586);
  write_optional_checkmark('Q4_medical_worker', 79, 586);
  write_optional_checkmark('Q4_age_65_plus', 239, 586);
  write_optional_checkmark('Q4_age_60_64', 364, 586);
  write_optional_checkmark('Q4_care_worker', 494, 586);
  write_optional_checkmark('Q4_has_disease', 79, 612);
  write_str_on_img(Q.Q4_disease.value, 306, 612);

  write_YN_checkmark('Q5', 705);
  write_optional_checkmark('Q5_has_heart_disease', 172, 689);
  write_optional_checkmark('Q5_has_kidney_disease', 267, 689);
  write_optional_checkmark('Q5_has_liver_disease', 361, 689);
  write_optional_checkmark('Q5_has_blood_disease', 456, 689);
  write_optional_checkmark('Q5_has_a_bleeding_problem', 568, 689);
  write_optional_checkmark('Q5_has_immune_deficiency', 770, 689);
  write_optional_checkmark('Q5_has_other_diseases', 172, 724);
  write_str_on_img(Q.Q5_disease_name.value, 255, 724);
  write_optional_checkmark('Q5_take_blood_thinner', 172, 759);
  write_str_on_img(Q.Q5_blood_thinner.value, 371, 759);
  write_optional_checkmark('Q5_take_other_drugs', 576, 759);
  write_str_on_img(Q.Q5_other_drugs.value, 655, 759);

  write_YN_checkmark('Q6', 803);
  write_str_on_img(Q.Q6_desease.value, 596, 803);

  write_YN_checkmark('Q7', 843);
  write_str_on_img(Q.Q7_symptoms.value, 466, 843);

  write_YN_checkmark('Q8', 883);

  write_YN_checkmark('Q9', 931);
  write_str_on_img(Q.Q9_allergens.value, 330, 944);

  write_YN_checkmark('Q10', 989);
  write_str_on_img(Q.Q10_vaccine.value, 130, 1002);
  write_str_on_img(Q.Q10_symptoms.value, 553, 1002);

  write_YN_checkmark('Q11', 1037);

  write_YN_checkmark('Q12', 1076);
  write_str_on_img(Q.Q12_vaccine.value, 444, 1076);
  const Q12_jabbed_date = Q.Q12_jabbed_date.value;
  if (Q12_jabbed_date) {
    const Q12_jd_dateobj = new Date(Q12_jabbed_date),
          Q12_jd_m = Q12_jd_dateobj.getMonth() + 1,
          Q12_jd_d = Q12_jd_dateobj.getDate(),
          Q12_jd_str = `${Q12_jd_m}月${Q12_jd_d}日`;
    write_str_on_img(Q12_jd_str, 733, 1076);
  }

  write_YN_checkmark('Q13', 1116);
}


/* ラジオボタンで選択されている項目の value を返す。 */
function selected_radio_choice(radio_elt) {
  for (let choice of radio_elt) {
    if (choice.checked) { return(choice.value); }
  }
  return('');
}

/* プルダウンリスト（セレクタ）で選択されている項目の value を返す。 */
function selected_choice(sel_elt) {
  return(sel_elt.options[sel_elt.selectedIndex].value);
}

/*
予診票の上の指定された位置に、文字列を書き込む（文字列の左下隅に相当する位置の
座標を指定する）。
本当は、文字列の長さと記入欄の大きさとの兼ね合いで、フォントサイズの調整や
折り返しが必要になるのだろうが、とりあえず無視。
*/
function write_str_on_img(str, x, y, font_family = Font_family, font_size = Font_size) {
  //この順で連結しないとなぜかうまくフォントが設定されないようだ。
  ctx.font = font_size + font_family; 
  ctx.fillText(str, x, y);
}

/*予診票の上の指定された位置にレ点を書き込む。*/
function write_checkmark(x, y) {
  write_str_on_img('✓', x, y, Font_family, Font_size);
}
/* 同様に、丸を書き込む。*/
function write_circle(x, y) {
  write_str_on_img('○', x, y, Font_family, Font_size);
}

/*
「はい」「いいえ」の欄は縦に整列している（どの質問でも x 座標が同じである）ので、
y 座標さえ指定すれば、レ点を適切な位置に出力できる。
*/
function write_YN_checkmark(radio_name, y) {
  //今回の予診票に特有の x 座標（レ点の左座標）
  const YES_column_x = 885, NO_column_x = 975;

  const r = document.questionnaire[radio_name];
  if (r[0].checked) { write_checkmark(YES_column_x, y); }
  if (r[1].checked) { write_checkmark(NO_column_x, y); }
}

/*
チェックボックスは予診票の上のばらばらな位置にあるので、
x 座標と y 座標の双方が必要。
*/
function write_optional_checkmark(checkbox_name, x, y) {
  if (document.questionnaire[checkbox_name].checked) {
    write_checkmark(x, y);
  }
}

/*
日付ピッカーから入力された日付を、「　　月　　日」とある記入欄に記入する。
*/
function write_month_and_date(date_name, month_x, date_x, y) {
  const input_date_val = document.questionnaire[date_name].value;
  if (input_date_val) { // 日付入力あり
    const input_date = new Date(input_date_val);
    write_str_on_img(input_date.getMonth() + 1, month_x, y);
    write_str_on_img(input_date.getDate(), date_x, y);
  }
}

/*
この関数への入力は、数字の並びであるような文字列。
一桁ずつ、個別の入力枠に記入する箇所向け。
なお、
  * 必要に応じてゼロ埋めをすべき欄、
  * 入力値の性質からしてゼロ埋めが生じない欄、
  * 電話番号のようにユーザにゼロも含めて入力してもらうのが自然な欄、
などと色々ありうるだろうが、それらの色々な事情は呼び出し側で対処しておくこと。
*/
function write_digits(digits_str, most_significant_digit_x, y, dx = Diff_x_to_next_digit) {
  const L = digits_str.length;
  for (let i = 0; i < L; i ++) {
    write_str_on_img(digits_str[i], most_significant_digit_x + dx * i, y, Digit_font_family);
  }
}
