$(function () {
    var hoge = function () {
        return hogehoge();
    };
    $('body').append(hoge());
    console.log('done.');
});
