// add window.fetch polyfill from
// https://github.com/developit/unfetch
const XMLHttpRequest = require('xhr2');
function fetch(e, n) { return n = n || {}, new Promise(function (t, s) { var r = new XMLHttpRequest, o = [], u = [], i = {}, a = function () { return { ok: 2 == (r.status / 100 | 0), statusText: r.statusText, status: r.status, url: r.responseURL, text: function () { return Promise.resolve(r.responseText) }, json: function () { return Promise.resolve(JSON.parse(r.responseText)) }, blob: function () { return Promise.resolve(new Blob([r.response])) }, clone: a, headers: { keys: function () { return o }, entries: function () { return u }, get: function (e) { return i[e.toLowerCase()] }, has: function (e) { return e.toLowerCase() in i } } } }; for (var c in r.open(n.method || "get", e, !0), r.onload = function () { r.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (e, n, t) { o.push(n = n.toLowerCase()), u.push([n, t]), i[n] = i[n] ? i[n] + "," + t : t }), t(a()) }, r.onerror = s, r.withCredentials = "include" == n.credentials, n.headers) r.setRequestHeader(c, n.headers[c]); r.send(n.body || null) }) }

/** namey */
const namey = {
    /**
     * API for namey random name generator.  There's two basic ways to use it.  First, just call namey.get with a callback:
     *
     * namey.get(function(n) { console.log(n); }); => ["John Clark"]
     *
     * The call returns an array because there's an option to request more than one random name. For example:
     *
     * namey.get({ count: 3, callback: function(n) { console.log(n); }}); ; => ["John Cook", "Ruth Fisher", "Donna Collins"]
     *
     * Here's the full list of parameters:
     * 
     * count -- how many names you would like (default: 1)
     *
     * type -- what sort of name you want 'female', 'male', 'surname', or leave blank if you want both genders
     *
     * with_surname -- true/false, if you want surnames with the first
     * name. If false, you'll just get first names.  Default is true.
     *
     * frequency -- 'common', 'rare', 'all' -- default is 'common'. This
     * picks a subset of names from the database -- common names are
     * names that occur frequently, rare is names that occur rarely.
     * 
     * min_freq/max_freq  -- specific values to get back a really
     * specific subset of the names db. values should be between 0 and
     * 100. You probably don't need this, but here's an example:
     * namey.get({ count: 3, min_freq: 30, max_freq: 50, callback: function(n) { console.log(n); }});
     * => ["Crystal Zimmerman", "Joshua Rivas", "Tina Bryan"]
     *
     * callback -- a function to do something with the data.  The data
     * passed in will be an array of names -- use them wisely.
     * 
     */
    get: function (options) {
        var callback;
        var tmp_params = {};
        var host = "namey.muffinlabs.com";
        //var host = window.location.host;
        var query;

        if (typeof (options) == "function") {
            callback = options;
        }
        else if (typeof (options) == "object") {
            callback = options.callback;

            if (typeof (options.host) !== "undefined") {
                host = options.host;
            }

            if (typeof (options.count) == "undefined") {
                options.count = 1;
            }
            tmp_params.count = options.count;

            if (typeof (options.type) != "undefined" && options.type != "both") {
                tmp_params.type = options.type;
            };

            if (options.type != "surname" && typeof (options.with_surname) != "undefined") {
                tmp_params.with_surname = options.with_surname;
            }
            if (options.min_freq) {
                tmp_params.min_freq = options.min_freq;
                tmp_params.max_freq = options.max_freq;
            }
            else if (typeof (options.frequency) != "undefined") {
                tmp_params.frequency = options.frequency;
            }
        }


        query = Object.keys(tmp_params)
            .map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(tmp_params[k]);
            })
            .join('&');

        fetch('https://namey.muffinlabs.com/name.json?' + query, { mode: 'cors' })
            .then(function (d) { return d.json(); })
            .then(function (d) {
                if (typeof (callback) == "function") {
                    callback(d);
                }
                else {
                    console.log(d);
                }
            });
    },
    new: async function () {
        return new Promise((resolve, reject) => {
            try {
                namey.get({ callback: resolve });
            } catch (error) {
                resolve(['EasyCoin']);
            }
        });
    }
}

module.exports = {
    namey,
};