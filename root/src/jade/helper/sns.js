module.exports = {
    render_tag: function (tagName, attr, text) {
        tagName = tagName || 'div';
        attr = attr || {};
        text = text || '';

        var attrList = [];
        for (var key in attr) {
            attrList.push(key + '=' + '"' + attr[key] + '"');
        }
        return '<' + tagName + ' ' + attrList.join(' ') + '>' + text + '</' + tagName + '>';
    },
    fb_like_button: function (opts) {
        opts = opts || {};

        var undef;

        var href = opts.href;
        var layout = opts.layout || 'button_count';
        var action = opts.action || 'like';
        var showFace = opts.showFace || 'false';
        var share = !!opts.share;

        var attr = {
            'class': "fb-like",
            'data-layout': layout,
            'data-action': action,
            'data-show-faces': showFace ? 'true' : 'false',
            'data-share': share ? 'true' : 'false'
        };
        if (href) {
            attr['data-href'] = href;
        }

        return this.render_tag('div', attr);
    },
    fb_share_button: function (opts) {
        opts = opts || {};

        var undef;

        var href = opts.href;
        var layout = opts.layout || 'button_count';

        var attr = {
            'class': "fb-share-button",
            'data-layout': layout
        };
        if (href) {
            attr['data-href'] = href;
        }

        return this.render_tag('div', attr);
    },
    fb_root: function (appId) {
        return [
            '(function(d, s, id) {',
            'var js, fjs = d.getElementsByTagName(s)[0];',
            'if (d.getElementById(id)) return;',
            'js = d.createElement(s); js.id = id;',
            'js.src = "//connect.facebook.net/ja_JP/sdk.js#xfbml=1' + (appId ? '&appId=' + appId : '') + '&version=v2.0";',
            'fjs.parentNode.insertBefore(js, fjs);',
            '}(document, \'script\', \'facebook-jssdk\'));'
        ].join('');
    },
    tweet_button: function (opts) {
        opts = opts || {};

        var undef;

        var url = opts.url;
        var count = (opts.count === undef) ? true : opts.count;
        var text = opts.text;
        var hashtags = opts.hashtags;

        var attr = {
            'href': 'https://twitter.com/share',
            'class': 'twitter-share-button'
        };
        if (url) {
            attr['data-url'] = url;
        }
        if (!count) {
            attr['data-count'] = 'none';
        }
        if (text) {
            attr['data-text'] = text;
        }
        if (hashtags && hashtags.length) {
            attr['data-hashtags'] = hashtags.join(',');
        }
        return this.render_tag('a', attr, 'Tweet');
    },
    twitter_wjs: function () {
        return '!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');';
    },
    line_button: function (opts) {
        opts = opts || {};

        var undef;

        var param = {
            pc: !!opts.pc,
            lang: opts.land || "ja",
            type: opts.type || 'a',
            text: opts.text || '',
            withUrl: (opts.withUrl === undef) ? true : opts.withUrl
        };

        return [
            '<span>',
            '<script type="text/javascript">',
            'new media_line_me.LineButton(' + JSON.stringify(param) + ');',
            '</script>',
            '</span>'
        ].join('\n');
    },
    line_button_script: function () {
        return '<script type="text/javascript" src="//media.line.me/js/line-button.js?v=20140411" ></script>';
    },
    line_link: function (opts) {
        opts = opts || {};
        var buf = [];
        if (opts.text) {
            buf.push(opts.text);
        }
        if (opts.url) {
            buf.push(opts.url);
        }
        return 'http://line.me/R/msg/text/?' + encodeURIComponent(buf.join(' '));
    }
};