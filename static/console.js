

// /abcd#console:sort,uniqc,sortn

var haste_console = function(options) {
	this.$options = options;

	this.d = "\n";

	this.opMap = {
		'uniqc' : 'opUniqCount',
		'sort' : 'opSort',
		'sortn' : 'opSortNumeric',
		'reverse' : 'opReverse',
		'test' : 'opWrap'
	};

	this.uiInit();
};

haste_console.prototype.uiShow = function() {
	$('body').addClass('console');
};
haste_console.prototype.uiHide = function() {
	$('body').removeClass('console');
};

haste_console.prototype.uiInit = function() {
	var _this = this;
	$('#console_ui').find('.new').change(function(e) {
		if($(this).val() == "") return;

		var args = _this.getArgs();
		args.push( $(this).val() );
		_this.setArgs(args);

		$(this).val("");
	});
};

haste_console.prototype.uiUpdate = function() {
	var _this = this;

	var wrapper = $('#console_ui');

	wrapper.find('.active').empty();

	$(this.getArgs()).each(function(i, op) {
		wrapper.find('.active').append(
			$('<li />')
				.text(op)
				.attr('class', 'op')
				.attr('data-idx', i)
				.attr('data-op', op)
				.append(
					$('<a />')
						.html('&cross;')
						.attr('href', '#')
						.attr('class', 'x')
						.attr('data-idx', i)
						.click(function(e) {
							e.preventDefault();
							var idx = $(this).attr('data-idx')
							var args = _this.getArgs();
							args.splice(idx, 1);
							_this.setArgs(args);
						})
				)
		);
	});
};


haste_console.prototype.isConsoleMode = function() {
	var args = this.getArgs();
	return args !== null;
};


haste_console.prototype.setArgs = function(args) {
	location.hash = 'console:' + args.join(',');
};

haste_console.prototype.getArgs = function() {
	var tag = 'console:';
	var lochash = location.hash.substr(1);
	var p = lochash.indexOf(tag);
	if(p >= 0) {
		var sub = lochash.substr(p+tag.length);
		return sub.length == 0 ? [] : sub.split(',');
	}
	else {
		return null;
	}
};

haste_console.prototype.operate = function(input) {
	var ops = this.getArgs();

	this.uiUpdate();

	for(var i in ops) {
		var fname = this.opMap[ ops[i] ];
		if( typeof this[fname] == 'function' ) {
			input = this[fname](input);
		}
	}

	return input;
};

haste_console.prototype.colour = function(input) {
	var output = '';

	var flags = {};

	var classmap = {
		'1' : 'b',
		'4' : 'u',
		'1;30' : 'blk',
		'1;31' : 'lred',
		'1;32' : 'lgrn',
		'1;33' : 'lyel',
		'1;34' : 'lblu',
		'1;35' : 'lpnk',
		'1;36' : 'lcya',
		'1;37' : 'lwht',
		'2;30' : 'blk',
		'2;31' : 'dred',
		'2;32' : 'dgrn',
		'2;33' : 'dyel',
		'2;34' : 'dblu',
		'2;35' : 'dpnk',
		'2;36' : 'dcya',
		'2;37' : 'dwht',
	}

	var fn = function(str, p1, p2, offset, s) {
		//console.log([p1, flags]);

		if(p1 == '0') {
			if(Object.keys(flags).length > 0) {
				flags = {};
				return '</i>';
			}
			else return '';
		}

		var ret = Object.keys(flags).length > 0 ? '</i>' : '';

		if(typeof(classmap[p1]) == 'string') {
			flags[ classmap[p1] ] = 1;
		}

		var classes = $.map(Object.keys(flags), function(x) { return '_'+x; });

		ret += '<i class="' + classes.join(' ') + '">';

		return ret;
	};

	return input.replace(/\x1B\[([01](;[0-9]+)?)m/g, fn);
}

/// ops

haste_console.prototype.opTest = function(input) {
	return $.map(input.split(this.d), function(line) { return '['+line+']'; }).join(this.d);
};

haste_console.prototype.opSort = function(input) {
	return input.split(this.d).sort().join(this.d);
};

haste_console.prototype.opSortNumeric = function(input) {
	var numcomp = function(a, b) {
		if(a == b) return 0;
		var nums = [/[0-9]+/.exec(a), /[0-9]+/.exec(b)];
		if(nums[0] == nums[1]) return 0;
		if(nums[1] === null) return -1;
		if(nums[0] === null) return 1;
		return nums[0] - nums[1];
	};

	return input.split(this.d).sort(numcomp).join(this.d);
};

haste_console.prototype.opUniqCount = function(input) {
	var lines = [];
	var counts = [];

	$( input.split(this.d) ).each(function(x, line) {
		if(lines.length == 0 || lines[lines.length-1] != line) {
			lines.push(line);
			counts.push(1);
		}
		else {
			counts[counts.length-1] ++;
		}
	});

	var maxCount = Math.max.apply(null, counts);
	var numWidth = (''+maxCount).length;

	var pad = function pad(str, max, char) {
		str = str.toString();
		return str.length < max ? pad(char + str, max, char) : str;
	};

	return $.map(lines, function(line, i) {
		return pad(counts[i], numWidth, ' ') + ' ' + line;
	}).join(this.d);
};

haste_console.prototype.opReverse = function(input) {
	return input.split(this.d).reverse().join(this.d);
};



