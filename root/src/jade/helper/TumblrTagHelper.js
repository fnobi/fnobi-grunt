module.exports = {
    data: {
        available: false,
        isPermalinkPage: false,
        blog: {},
        custom: {
            image: {}
        },
        posts: []
    },
    title: function (post) {
        if (this.data.available) {
            if (post) {
                return post.title;
            } else {
                return this.data.blog.title;
            }
        } else {
            return '{Title}';
        }
    },
    description: function (post) {
        if (this.data.available) {
            if (post) {
                return post.description;
            } else {
                return this.data.blog.description;
            }
        } else {
            return '{Description}';
        }
    },
    metaDescription: function () {
        if (this.data.available) {
            return this.data.blog.description.replace(/\n+/g, ' ');
        } else {
            return '{MetaDescription}';
        }
    },
    body: function (post) {
        if (this.data.available) {
            if (post) {
                return post.body;
            } else {
                return this.data.blog.body;
            }
        } else {
            return '{Body}';
        }
    },
    blogURL: function () {
        if (this.data.available) {
            return this.data.blog.url;
        } else {
            return '{BlogURL}';
        }
    },
    urlEncodedBlogURL: function () {
        if (this.data.available) {
            return escape(this.blogURL());
        } else {
            return '{URLEncodedBlogURL}';
        }
    },
    permalink: function (post) {
        if (this.data.available) {
            if (post) {
                return post.post_url;
            } else {
                return '';
            }
        } else {
            return '{Permalink}';
        }
    },
    photoURL500: function (photo) {
        return this._photoURL(photo, 500);
    },
    photoURL400: function (photo) {
        return this._photoURL(photo, 400);
    },
    photoURL250: function (photo) {
        return this._photoURL(photo, 250);
    },
    photoURL100: function (photo) {
        return this._photoURL(photo, 100);
    },
    photoURL75sq: function (photo) {
        return this._photoURL(photo, 75);
    },
    _photoURL: function (photo, size) {
        if (this.data.available) {
            if (photo) {
                var altSize;
                for (var i = 0; i < photo.alt_sizes.length; i++) {
                    if (!altSize && photo.alt_sizes[i].width <= size) {
                        altSize = photo.alt_sizes[i];
                    }
                }
                return altSize ? altSize.url : '';
            } else {
                return '';
            }
        } else {
            return '{PhotoURL-' + size + '}';
        }
    },
    photoURLHighRes: function (photo) {
        if (this.data.available) {
            if (photo) {
                return photo.original_size.url;
            } else {
                return '';
            }
        } else {
            return '{PhotoURL-HighRes}';
        }
    },
    customDeclearMeta: function () {
        if (this.data.available) {
            return '';
        }
        var custom = this.data.custom;
        var image = custom.image;
        var buf = [];
        for (var name in image) {
            buf.push('<meta name="image:' + name + '" content="' + image[name] + '" />');
        }
        return buf.join('');
    },
    customImage: function (name) {
        if (this.data.available) {
            return this.data.custom.image[name] || '';
        } else {
            return '{image:' + name + '}';
        }
    },
    video700: function (post) {
        return this._video(post, 700);
    },
    video500: function (post) {
        return this._video(post, 500);
    },
    video400: function (post) {
        return this._video(post, 400);
    },
    video250: function (post) {
        return this._video(post, 250);
    },
    _video: function (post, size) {
        if (this.data.available) {
            if (post && post.player) {
                var player = { embed_code: '' };
                for (var i = 0; i < post.player.length; i++) {
                    if (post.player[i].width <= size) {
                        player = post.player[i];
                    }
                }
                return player.embed_code;
            } else {
                return '';
            }
        } else {
            return '{Video-' + size + '}';
        }
    },
    url: function (post) {
        if (this.data.available) {
            if (post) {
                return post.url;
            } else {
                return '';
            }
        } else {
            return '{URL}';
        }
    },
    name: function (post) {
        if (this.data.available) {
            if (post) {
                return post.title;
            } else {
                return '';
            }
        } else {
            return '{Name}';
        }
    },
    tagsForClassName: function (post, prefix) {
        prefix = prefix || '';
        if (this.data.available) {
            if (post) {
                var list = [];
                (post.tags || []).forEach(function (tag) {
                    list.push(prefix + tag);
                });
                return list.join(' ');
            } else {
                return '';
            }
        } else {
            return ['{block:Tags}', prefix, '{URLSafeTag}', ' ', '{/block:Tags}'].join('');
        }
    },
    taggedPosts: function () {
        var tagName = this.data.pageTagName;
        var posts = [];
        this.data.posts.forEach(function (post, index) {
            var tags = post.tags || [];
            var hit = false;
            tags.forEach(function (tag) {
                hit = hit || (tag == tagName);
            });
            if (hit) {
                posts.push(post);
            }
        });
        return posts;
    },
    caption: function (post) {
        if (this.data.available) {
            if (post) {
                return post.caption;
            } else {
                return '';
            }
        } else {
            return '{Caption}';
        }
    },
    copyrightYears: function () {
        if (this.data.available) {
            return (new Date()).getFullYear();
        } else {
            return '{CopyrightYears}';
        }
    },
    portraitURL128: function () {
        return this._portraitURL(128);
    },
    portraitURL96: function () {
        return this._portraitURL(96);
    },
    portraitURL64: function () {
        return this._portraitURL(64);
    },
    portraitURL48: function () {
        return this._portraitURL(48);
    },
    portraitURL40: function () {
        return this._portraitURL(40);
    },
    portraitURL30: function () {
        return this._portraitURL(30);
    },
    portraitURL24: function () {
        return this._portraitURL(24);
    },
    portraitURL16: function () {
        return this._portraitURL(16);
    },
    _portraitURL: function (size) {
        if (this.data.available) {
            return '';
        } else {
            return '{PortraitURL-' + size + '}';
        }
    },
    favicon: function () {
        if (this.data.available) {
            return '';
        } else {
            return '{Favicon}';
        }        
    },
    year: function (post) {
        if (this.data.available) {
            var d;
            if (post) {
                d = new Date(post.date);
            } else {
                d = new Date();
            }
            return d.getFullYear();
        } else {
            return '{Year}';
        }
    },
    dayOfMonth: function (post) {
        if (this.data.available) {
            var d;
            if (post) {
                d = new Date(post.date);
            } else {
                d = new Date();
            }
            return d.getDate();
        } else {
            return '{DayOfMonth}';
        }
    },
    monthNumber: function (post) {
        if (this.data.available) {
            var d;
            if (post) {
                d = new Date(post.date);
            } else {
                d = new Date();
            }
            return (d.getMonth() + 1);
        } else {
            return '{MonthNumber}';
        }
    }
};
