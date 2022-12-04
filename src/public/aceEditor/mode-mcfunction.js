define("ace/mode/mcfunction_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

	var MCfunctionHighlightRules = function() {
		let _Setfunctions = 'advancement|ban|ban-ip|banlist|bossbar|clear|clone|data'   +
							'|datapack|debug|defaultgamemode|deop|difficulty|effect'    +
							'|enchant|execute|experience|fill|function|gamemode'        +
							'|gamerule|give|help|kick|kill|list|locate|me|msg|op|pardon'+
							'|pardon-ip|particle|playsound|publish|recipe|reload'       +
							'|replaceitem|save-all|save-off|save-on|say|scoreboard|seed'+
							'|setblock|setidletimeout|setworldspawn|spawnpoint'         +
							'|spreadplayers|stop|stopsound|summon|tag|team|teleport'    +
							'|tell|tellraw|time|title|tp|trigger|w|weather|whitelist'   +
							'|worldborder|xp';
								
		let _Settag      =   'advancements|distance|dx|dy|dz|gamemode|level|limit|name'  +
							'|nbt|scores|sort|tag|type|team|x_rotation|x|y_rotation|y|z';
			
		this.$rules = {
			"start" : [
				{
					token : 'comment',
					regex : '#(.*)'
				},
				{
					token : 'paren.keyword.operator',
					regex : '[[({]'
				},
				{
					token : 'paren.keyword.operator',
					regex : '[\\])}]'
				},
				{
					token : 'keyword.operator',
					regex : /(-=|\*=|\/=|#minecraft:|%=|\+=|<|=|>|><|<=|>=)/
				},
				{
				    token : 'variable',
				    regex : /@[aeprs]/
				},
				{
					token : 'function',
					regex : '\\b('+ _Setfunctions +')\\b(?!\=)'
				},
				{
					token : 'keyword',
					regex : '\\b('+ _Settag +')\\b(?=\=)'
				},
				{
					token : 'keyword',
					regex : '\\b(matches)\\b(?= )'
				}
			]
		};
	};

	MCfunctionHighlightRules.metaData = {
		fileTypes: ["mcfunction"],
		name: "MCfunction"
	}

	oop.inherits(MCfunctionHighlightRules, TextHighlightRules);
	
	exports.MCfunctionHighlightRules = MCfunctionHighlightRules;
});

define("ace/mode/mcfunction",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/mcfunction_highlight_rules"], function(require, exports, module) {
	"use strict";
	var oop = require("../lib/oop");
	var TextMode = require("./text").Mode;
	var MCfunctionHighlightRules = require("./mcfunction_highlight_rules").MCfunctionHighlightRules;
	var Mode = function() {
		this.HighlightRules = MCfunctionHighlightRules;
		this.$behaviour = this.$defaultBehaviour;
	};
	oop.inherits(Mode, TextMode);

	(function() {
		this.lineCommentStart = "#";
		this.$id = "ace/mode/mcfunction";
	}).call(Mode.prototype);

	exports.Mode = Mode;
});                (function() {
                    window.require(["ace/mode/mcfunction"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            