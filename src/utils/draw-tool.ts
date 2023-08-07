/*
 * file: canvas卡片绘制工具函数
 */
/*
多行文字显示，可指定文本位置，最大行数，宽度，行高
distX, distY,width, maxLine, lineHeight
*/
/**
 * 多行文字显示，可指定文本位置，最大行数，宽度，行高
 * @param {any} ctx        canvas 的 getContext('2d')
 * @param {string} text    文本
 * @param textObj          文本显示样式设置
 * {
	distX:number,
	distY:number,
	width:number,
	color:string,
	bolder:boolean,
	maxLine:number,
	lineHeight:number,
 }
 * @param {string} fontFamiry   字体，可选，默认值微软雅黑
 */
function multiText(ctx, text, textObj, fontFamiry = '微软雅黑') {
	let {
		distX, distY, width, maxLine, lineHeight, font, color, bolder,
	} = textObj;
	ctx.save();
	ctx.font = (bolder ? 'bold ' : '') + font + 'px ' + fontFamiry;
	ctx.fillStyle = color;
	let words = text.split('');
	let line = '';
	let lines = 1;
	for (let i = 0; i < words.length; i++) {
		line += words[i];
		/* 文字内容全部取完，直接绘制文字 */
		if (i === words.length - 1) {
			ctx.fillText(line, distX, distY, width);
			break;
		}
		if (ctx.measureText(line).width >= width) {
			/* 已经到达最大行数，用省略号代替后面的部分 */
			if (lines === maxLine) {
				line = line.slice(0, line.length - 3) + '...';
			}
			ctx.fillText(line, distX, distY, width);
			if (lines === maxLine) {
				break;
			}
			line = '';
			distY += lineHeight;
			lines += 1;
		}
	}
	ctx.restore();
}

/**
 * 时间戳的格式化
 * @param {number} timeStamp 时间戳
 * @param {string} line 分隔符，可选。默认值为'-'
 */
function timeParse(timeStamp, line = '-') {
	let t = new Date(timeStamp);
	let week = '';

	switch (t.getDay()) {
		case 1: week = '一'; break;
		case 2: week = '二'; break;
		case 3: week = '三'; break;
		case 4: week = '四'; break;
		case 5: week = '五'; break;
		case 6: week = '六'; break;
		case 0: week = '日'; break;
	}

	let month = t.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	let day = t.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let hours = t.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}

	let monutes = t.getMinutes();
	if (monutes < 10) {
		monutes = '0' + monutes;
	}

	let formateTime = {};
	formateTime.date = t.getFullYear() + line + month + line + day;
	formateTime.day = '星期' + week + ' ';
	formateTime.time = hours + ':' + monutes;
	return formateTime;
}

/**
 * 绘制单行文本
 * @param {any} ctx        canvas 的 getContext('2d')
 * @param {string} text    文本
 * @param {object} textObj 文本显示样式设置
 * {
	left:number,
	top:number,
	font:number,
	color:string,
	bolder:boolean }
 * @param {string} fontFamiry   字体，可选，默认值微软雅黑
 */
function drawText(ctx, text, textObj, fontFamiry = '微软雅黑') {
	let {
		left, top, font, color, bolder,
	} = textObj;
	ctx.font = (bolder ? 'bold ' : '') + font + 'px ' + fontFamiry;
	ctx.fillStyle = color;
	ctx.fillText(text || textObj.text, left, top);
}

/**
 * 绘制单行文本,可以指定字的宽度
 * @param {any} ctx        canvas 的 getContext('2d')
 * @param {string} str     文本
 * @param {object} textObj 文本显示样式设置
 * {
	x:number,
	y:number,
	spaceWidth:number,
	font:number,
	color:string,
	bolder:boolean}
 * @param {string} fontFamiry    字体，可选，默认值微软雅黑
 */
function drawTextSpace(ctx, str, textObj, fontFamiry = '微软雅黑') {
	let {
		x, y, spaceWidth, font, color, bolder,
	} = textObj;
	let strArray = str.split('');
	for (let i = 0; i < strArray.length; i++) {
		ctx.font = (bolder ? 'bold ' : '') + font + 'px ' + fontFamiry;
		ctx.fillStyle = color;
		ctx.fillText(strArray[i], x + spaceWidth * i, y);
	}
}

/**
 * 画圆角矩形块，渐变色块
 *（可以用于画透明层色块，渐变层）
 *（可以设置上面是圆角，下面是直角 ）
 * headBgClipRounded 方法如果单独使用，填充请手动加上ctx.fill();
 * @param {any} ctx       canvas 的 getContext('2d')
 * @param {object}clipObj 图片显示样式设置
 * {
	x:number,
	y:number,
	w:number,
	h:number,
	r:{
		r_top_right:number,
		r_bottom_right:number,
		r_bottom_left:number,
		r_top_left:number
	},
	bdWidth:number, //边框的宽度厚度
	bdColor:string, //边框的颜色
	bgcolor:string, //背景色（如果isLinear为true时，bgcolor作为渐变第一色）
	isLinear:boolean,  //是否渐变
	linearColor:string,  //渐变的第二色
	}
 */
function headBgClipRounded(ctx, clipObj) {
	let {
		x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor,
	} = clipObj;
	let r_all = '';
	if (typeof r === 'number' || typeof r === 'string') {
		r_all = r;
	}
	ctx.moveTo(x + (r_all || r.r_top_left), y);
	ctx.lineWidth = bdWidth;
	ctx.strokeStyle = bdColor;

	if (isLinear) {
		/* 指定渐变区域 */
		let grad = ctx.createLinearGradient(0, 0, 0, h);
		/* 指定几个颜色 */
		grad.addColorStop(0, bgcolor);
		grad.addColorStop(1, linearColor);
		/* 将这个渐变设置为fillStyle */
		ctx.fillStyle = grad;
	} else {
		ctx.fillStyle = bgcolor;
	}

	ctx.arcTo(x + w, y, x + w, y + h, r_all || r.r_top_right);
	ctx.arcTo(x + w, y + h, x, y + h, r_all || r.r_bottom_right);
	ctx.arcTo(x, y + h, x, y, r_all || r.r_bottom_left);
	ctx.arcTo(x, y, x + w, y, r_all || r.r_top_left);
	ctx.stroke();
	ctx.fill();
}

/* 画图方法 */

/**
 * 画图方法，指定图片的位置和宽高
 * @param {any} ctx         canvas 的 getContext('2d')
 * @param {string} bgUrl    图片链接
 * @param {object} imageObj 图片显示样式设置
 * {
	left:number,
	top:number,
	width:number,
	height:number,
	isClip?:boolean,
	x?:number,
	y?:number,
	w?:number,
	h?:number,
	r?:number,
	bdWidth?:number,
	bdColor?:string,
	bgcolor?:string,
	isLinear?:boolean,
	linearColor?:string}
 * @param {function} imageProxyFunc
 * @param {function} cb
 */
function drawImage(ctx, bgUrl, imageObj, imageProxyFunc, cb) {
	if (bgUrl != '') {
		let bgImg = new Image();
		// if (/^data:image\/\w+;base64,/.test(bgUrl)) {
		// bgImg.crossOrigin = 'Anonymous';//跨域，如果是database64，则不需要这个
		// bgImg.setAttribute('crossOrigin', 'anonymous');
		// }
		bgImg.src = imageProxyFunc(bgUrl);
		bgImg.onload = function () {
			__drawPic(ctx, bgImg, imageObj);
			cb();
		};
	} else {
		__drawPic(ctx, '', '');
		cb();
	}
}

function __drawPic(ctx, bgImg, imageObj, cb) {
	let {
		top, left, width, height,
	} = imageObj;
	if (bgImg != '') {
		ctx.save();
		// ctx.globalCompositeOperation = 'destination-over';
		ctx.drawImage(bgImg, left, top, width, height);
		ctx.restore();
		cb?.();
	} else {
		ctx.beginPath();
		ctx.moveTo(left, top);
		ctx.fillStyle = '#fff';
		ctx.lineTo(left + width, top);
		ctx.lineTo(left + width, top + height);
		ctx.lineTo(left, top + height);
		ctx.closePath();
		ctx.fill();
		cb?.();
	}
}

/**
 * 处理图片跨域问题，如果是符合 /^data:image\/\w+;base64,/ 规则的图片，不做处理返回原链接，其余的都要处理返回新链接；
 * 该方法返回的方法参数是一个图片链接[string] 判断为空则返回空。
 * @param {string} api string  接口
 */
function imageProxy(api) {
	return function (url) {
		if (url != '') {
			if (/^data:image\/\w+;base64,/.test(url)) {
				return url;
			} else {
				return api + encodeURIComponent(url);
			}
		} else {
			return '';
		}
	};
}

/**
 * 应用于画图圆角矩形图片
 * @param ctx          canvas 的 getContext('2d')
 * @param bgUrl        图片链接
 * @param imageObj     图片显示样式设置
 * {
	left:number,
	top:number,
	width:number,
	height:number,
	isClip?:boolean,
	x?:number,
	y?:number,
	w?:number,
	h?:number,
	r?:number,
	bdWidth?:number,
	bdColor?:string,
	bgcolor?:string,
	isLinear?:boolean,
	linearColor?:string}
 * @param imageProxyFunc:any
 * @param cb any
 * 画经过 clip 的图片（圆形，圆角矩形）
 * imageObj:{left, top, width, height, isClip, x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor}
 */
function drawStyleImage(ctx, imageUrl, imageObj, imageProxyFunc, cb) {
	let {
		left, top, width, height, isClip, x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor,
	} = imageObj;
	ctx.save();

	if (isClip) {
		ctx.beginPath();
		r && headBgClipRounded(ctx, {
			x, y, w, h, r, bdWidth, bdColor, bgcolor, isLinear, linearColor,
		});
		ctx.closePath();
		ctx.clip();
	}

	drawImage(ctx, imageUrl, {
		left, top, width, height,
	}, imageProxyFunc, cb);
}

/**
 * 截取化图片某个尺寸，获取格式化后的链接
 * @param {string} url   链接
 * @param {string} formatStrQ   阿里云图片截取格式 "@64h_64w_1e_1c_2o"
 * @param {string} formatStrW   微信图片截取格式 "/64"
 *  图片截取大小格式化，获取链接 （兼容微信图片和阿里云图片）
 *
 *  例子：imgUrlFormat(url, "@64h_64w_1e_1c_2o", "/64");
 */

function imgUrlFormat(url, formatStrQ = '@64h_64w_1e_1c_2o', formatStrW = '/64') {
	if (/(img\.qlchat\.com)/.test(url)) {
		url = url.replace(/@.*/, '') + formatStrQ;
	} else if (/(wx\.qlogo\.cn\/mmopen)/.test(url)) {
		url = url.replace(/(\/(0|132|64|96)$)/, formatStrW);
	}

	return url;
}

/**
 * 冒泡对话框形状的图片
 * imageObj{x, y, w, h, r_all, bdWidth, bdColor, bgcolor, isLinear, linearColor }
 * 该方法当时用于冒泡对话框形状的图片剪切，目前只应用于一个场景，其他场景未必适用
 * @param {any}ctx      canvas 的 getContext('2d')
 * @param {object}imageObj  图片显示样式设置
 * {
	x:number,
	y:number,
	w:number,
	h:number,
	r:{
		r_top_right:number,
		r_bottom_right:number,
		r_bottom_left:number,
		r_top_left:number
	},
	bdWidth:number, //边框的宽度厚度
	bdColor:string, //边框的颜色
	bgcolor:string, //背景色（如果isLinear为true时，bgcolor作为渐变第一色）
	isLinear:boolean,  //是否渐变
	linearColor:string,  //渐变的第二色
	r_all:number}
 */
function headBgClipDialog(ctx, imageObj) {
	let {
		x, y, w, h, r_all, bdWidth, bdColor, bgcolor, isLinear, linearColor,
	} = imageObj;
	if (!r_all) { return false; }
	ctx.moveTo(x + r_all, y);
	ctx.lineWidth = bdWidth;
	ctx.strokeStyle = bdColor;

	if (isLinear) {
		/* 指定渐变区域 */
		let grad = ctx.createLinearGradient(0, 0, 0, h);
		/* 指定几个颜色 */
		grad.addColorStop(0, bgcolor);
		grad.addColorStop(1, linearColor);
		/* 将这个渐变设置为fillStyle */
		ctx.fillStyle = grad;
	} else {
		ctx.fillStyle = bgcolor;
	}

	ctx.arcTo(x + w, y, x + w, y + h, r_all);
	ctx.arcTo(x + w, y + h, x + 20, y + h, r_all);
	ctx.arcTo(x + 18, y + h, x + 12, y + h - 5, r_all);
	ctx.arcTo(x + 8, y + h + 2, x, y + h, r_all);
	ctx.arcTo(x + 4, y + h - 4, x + 8, y + h - 10, r_all);
	ctx.arcTo(x + 5, y + h - 12, x + 5, y + h - 20, r_all);
	ctx.arcTo(x + 5, y + h - 20, x + 5, y, r_all);
	ctx.arcTo(x + 5, y, x + w + 5, y, r_all);

	ctx.stroke();
}

/**
 * 加载特殊样式的数字图片
 * @param {Array} numUrlArray  是自定义的图片链接，定制规则是 0~9是数字0~9的图片，10是小数点，11是￥的符号,（12是+号，13是－号,14是:号，目前这三个没有默认图，不想报错又想用就自己上传吧，）。
 * 其他的符号的图片可后续优化添加。
 * @param {any} imageProxyFunc 图片代理方法
 * @param {function} cb 回调函数
 * 加载特殊样式的数字图片
 * loadNumImg( numUrlArray:[url:string],imageProxyFunc:any ,cb:any)
 * 使用时，先loadNumImg,获取图片数组。
 * 再使用showNumDraw方法画出数字图案。
 */
function loadNumImg(numUrlArray, imageProxyFunc, cb) {
	let a = 0;
	let numImfArray = [];
	let numUrlArray = numUrlArray.length > 0 ? numUrlArray : [
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-0.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-1.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-2.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-3.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-4.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-5.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-6.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-7.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-8.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-9.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-dian.png',
		'https://img.qlchat.com/qlLive/liveCommon/coupon-card-num-money.png',
	];
	for (let i = 0; i < numUrlArray.length; i++) {
		numImfArray[i] = new Image();
		numImfArray[i].crossOrigin = 'Anonymous';
		numImfArray[i].src = imageProxyFunc(numUrlArray[i]);
		numImfArray[i].onload = function () {
			a++;
			if (a >= numUrlArray.length) {
				typeof cb === 'function' && cb(numImfArray);
				return numImfArray;
			}
		};
	}
}
/**
 * 画特殊样式的数字
 * @param {any} ctx         canvas 的 getContext('2d')
 * @param {number} num      数字文本
 * @param {any}numObj       显示样式设置
 * {top:number,
	left:number,
	width:number,
	height:number }
 * @param {Array} numImfArray Array     显示图片的数组
 *    showNumDraw(ctx, num, numObj, numImfArray)
 *    numObj{ top, left, width, height } , width, height 定制每个数字字符的图片显示的宽高
 *    numImfArray 是应用的定制图片的数组
 *    使用showNumDraw方法画出数字图案。
 */
function showNumDraw(ctx, num, numObj, numImfArray) {
	let numString = num.toString().split('');
	let numLen = numString.length;
	let allWidth = numObj.width * numLen;
	for (let index = 0; index < numLen; index++) {
		const element = numString[index];
		if (element === '.') {
			drawNum(ctx, 10, index, numImfArray, allWidth);
		} else if (element === '￥') {
			drawNum(ctx, 11, index, numImfArray, allWidth);
		} else if (element === '+') {
			drawNum(ctx, 12, index, numImfArray, allWidth);
		} else if (element === '-') {
			drawNum(ctx, 13, index, numImfArray, allWidth);
		} else if (element === ':') {
			drawNum(ctx, 14, index, numImfArray, allWidth);
		} else {
			drawNum(ctx, Number(element), index, numImfArray, allWidth);
		}
	}
}
function drawNum(ctx, n, p, numObj, numImfArray, allWidth) {
	ctx.drawImage(
		numImfArray[n],
		numObj.left + numObj.width * p - (allWidth / 2),
		numObj.top,
		numObj.width,
		numObj.height,
	);
}

export {
	showNumDraw,
	loadNumImg,
	headBgClipDialog,
	imgUrlFormat,
	drawStyleImage,
	imageProxy,
	drawImage,
	headBgClipRounded,
	drawTextSpace,
	drawText,
	timeParse,
	multiText,
};
