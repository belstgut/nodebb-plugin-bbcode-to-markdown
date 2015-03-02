"use strict";

var converter = {};



function parseQuotes(content) {
	var quote, quoteBlock,
		re = /\[quote=["]?([\s\S]*?)["]?[:]?[\s\S]*?\]([\s\S]*?)\[\/quote[:]?[\s\S]*?\]/gi;

	while(quote = content.match(re)) {
		quote = quote[0];
		quoteBlock = quote.replace(re, '@$1 said:\n $2').replace(/[\r\n]/g, '\n>');
		content = content.replace(quote, quoteBlock);
	}

	return content;
}

function parseEmoji(content) {
	var smileyhash = {
		'Very Happy'        : ':grinning:',
		'Smile'             : ':smile:',
		'Wink'              : ':wink:',
		'Sad'               : ':worried',
		'Suprised'          : ':open_mouth:',
		'Shocked'           : ':scream:',
		'Confused'          : ':confused:',
		'Cool'              : ':sunglasses:',
		'Laughing'          : ':laughing:',
		'Mad'               : ':angry:',
		'Razz'              : ':stuck_out_tongue:',
		'Embarrassed'       : ':blush:',
		'Crying or Very Sad': ':cry:',
		'Evil or Very Mad'  : ':rage:',
		'Twisted Evil'      : ':smiling_imp:',
		'Rolling Eyes'      : ':innocent:',
		'Exclamation'       : ':exclamation:',
		'Question'          : ':question:',
		'Idea'              : ':bulb:',
		'Arrow'             : ':arrow_right:',
		'Neutral'           : ':neutral_face:',
		'Mr. Green'         : ':alien:',
		'Geek'              : ':neckbeard:',
		'Uber Geek'         : ':neckbeard:'
	};
	var smiley, smileyBlock, re = /<!--[\s\S]*?img[\s\S]*?src="{SMILIES_PATH}[\s\S]*?"[\s\S]*?title="([\s\S]*?)"[\s\S]*?>[\s\S]*?-->/gi;

	while(smiley = content.match(re)) {
		smiley = smiley[0];
		smileyBlock = smiley.replace(re, function(match, p1, offset, string) {
			return smileyhash[p1];
		});
		content = content.replace(smiley, smileyBlock);
	}

	return content;
}

converter.parse = function(postContent, callback) {
	postContent = postContent
		.replace('&#58;', ':')
		.replace('&qout;', '"')
		.replace(/\[color=([\s\S]*?):[\s\S]*?\]([\s\S]*?)\[\/color:[\s\S]*?\]/gi, '%($1)[$2]')
		.replace(/\[\S?b:[s\S]*?\]/gi, '**')
		.replace(/\[url=(https?:[\s\S]*?):[\s\S]*?\]([\s\S]*?)\[\/url:[\s\S]*?\]/gi, '[$2]($1)')
		.replace(/\[\S?url:[s\S]*?\]/gi, '')
		.replace(/\[\S?i:[s\S]*?\]/gi, '*')
		.replace(/\[code2=([\s\S]*?):[\s\S]*?\]([\s\S]*?)\[\/code2:[\s\S]*?\]/gi, '\n```$1\n$2\n```\n') // no idea how to prevent
		.replace(/\[code:[\s\S]*?\]([\s\S]*?)\[\/code:[\s\S]*?\]/gi, '\n```\n$1\n```\n') //  parsing inside code tags
		.replace(/\[quote:[\s\S]*?\]([\s\S]*?)\[\/quote:[\s\S]*?\]/gi, '> $1')
		.replace(/\[img:[\s\S]*?\]([\s\S]*?)\[\/img:[\s\S]*?\]/gi, '![$1]($1)')
		.replace(/<!--[\s\S]*?href="([\s\S]*?)"[\s\S]*?>([\s\S]*?)<[\s\S]*?-->/gi, '[$2]($1)');

	postContent = parseEmoji(postContent);
	postContent = parseQuotes(postContent);
	callback(null, postContent);
};

module.exports = converter;
