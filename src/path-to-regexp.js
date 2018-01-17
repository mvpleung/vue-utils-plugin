/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @return {!Array}
 */
function parse(str) {
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var defaultDelimiter = '/'
    var res

    while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length

        // Ignore already escaped sequences.
        if (escaped) {
            path += escaped[1]
            continue
        }

        var next = str[index]
        var prefix = res[2]
        var name = res[3]
        var capture = res[4]
        var group = res[5]
        var modifier = res[6]
        var asterisk = res[7]

        // Push the current path onto the tokens.
        if (path) {
            tokens.push(path)
            path = ''
        }

        var partial = prefix != null && next != null && next !== prefix
        var repeat = modifier === '+' || modifier === '*'
        var optional = modifier === '?' || modifier === '*'
        var delimiter = res[2] || defaultDelimiter
        var pattern = capture || group

        tokens.push({
            name: name || key++,
            prefix: prefix || '',
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            partial: partial,
            asterisk: !!asterisk,
            pattern: pattern ? pattern.replace(/([=!:$\/()])/g, '\\$1') : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
        })
    }

    // Match any characters still remaining.
    if (index < str.length) {
        path += str.substr(index)
    }

    // If the path exists, push it onto the end.
    if (path) {
        tokens.push(path)
    }

    return tokens
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g)

    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                partial: false,
                asterisk: false,
                pattern: null
            })
        }
    }

    return path;
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys) {
    return tokensToRegExp(parse(path), keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys) {
    var route = ''

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
            route += escapeString(token)
        } else {
            var prefix = escapeString(token.prefix)
            var capture = '(?:' + token.pattern + ')'

            keys.push(token)

            if (token.repeat) {
                capture += '(?:' + prefix + capture + ')*'
            }

            if (token.optional) {
                if (!token.partial) {
                    capture = '(?:' + prefix + '(' + capture + '))?'
                } else {
                    capture = prefix + '(' + capture + ')?'
                }
            } else {
                capture = prefix + '(' + capture + ')'
            }

            route += capture
        }
    }

    var delimiter = escapeString('/')
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?' + '$';

    return new RegExp('^' + route, 'i');
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @return {!RegExp}
 */
function pathToRegexp(path, keys) {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    return stringToRegexp( /** @type {string} */ (path), /** @type {!Array} */ (keys))
}