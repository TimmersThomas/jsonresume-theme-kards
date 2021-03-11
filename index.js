const fs = require("fs");

const Handlebars = require("handlebars");
const utils = require('handlebars-utils');
const marked = require('marked');
const moment = require('moment');

const less = require('less');
const purify = require("purify-css")
const htmlMinify = require('html-minifier').minify;

Handlebars.registerHelper('markdown', (str, locals, options) => {
	if (typeof str !== 'string') {
		options = locals;
		locals = str;
		str = true;
	}

	if (utils.isOptions(locals)) {
		options = locals;
		locals = {};
	}

	const ctx = utils.context(this, locals, options);
	const val = utils.value(str, ctx, options);

	const markup = marked(val);


	// If we end up with a string wrapped in one <p> block, remove it so we don't create a new text block
	const startEndMatch = markup.match(/^<p>(.*)<\/p>\n$/);
	return startEndMatch && startEndMatch[1].indexOf("<p>") === -1 ?
		startEndMatch[1] :
		markup;
});

Handlebars.registerHelper('displayUrl', (str) => {
	return str.replace(/https?:\/\//, "");
});

Handlebars.registerHelper('toLowerCase', (str) => {
	return str.toLowerCase();
});

Handlebars.registerHelper('date', (str) => {
	if (str) {
		const m = moment(str);
		return m.format("MMM YYYY");
	} else {
		return "Present"
	}
});

Handlebars.registerHelper('award', (str) => {
	switch (str.toLowerCase()) {
		case "bachelor":
		case "master":
			return str + "s";
		default:
			return str;
	}
});

Handlebars.registerHelper('skillLevel', (str) => {
	switch (str.toLowerCase()) {
		case "beginner":
			return "25";
		case "intermediate":
			return "50";
		case "advanced":
			return "75";
		case "master":
			return "100";
		default:
			return parseInt(str)
	}
});

// Resume.json used to have website property in some entries.  This has been renamed to url.
// However the demo data still uses the website property so we will also support the "wrong" property name.
// Fix the resume object to use url property
const fixResume = (resume) => {
	if (resume.basics.website) {
		resume.basics.url = resume.basics.website;
		delete resume.basics.website
	}
	fixAllEntries(resume.work);
	fixAllEntries(resume.volunteer);
	fixAllEntries(resume.publications);
	fixAllEntries(resume.projects);

	fixWork(resume.work);
}

const fixAllEntries = (entries) => {
	if (entries) {
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (entry.website) {
				entry.url = entry.website;
				delete entry.website;
			}
		}
	}
}

// work.company has been renamed as work.name in v1.0.0
function fixWork(work) {
	if (work) {
		for (let i = 0; i < work.length; i++) {
			const entry = work[i];
			if (entry.company) {
				entry.name = entry.company;
				delete entry.website;
			}
		}

	}
}

const render = async (resume) => {
	console.log('Hierrrr');
	fixResume(resume);

	const lessFile = fs.readFileSync(__dirname + "/Kards10/less/styles.less", "utf-8");
	const mainJs = fs.readFileSync(__dirname + "/Kards10/js/main.js", "utf-8");
	const pluginsJs = fs.readFileSync(__dirname + "/Kards10/js/plugins.js", "utf-8");
	const tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	const packageJSON = require("./package");

	const firstRun = Handlebars.compile(tpl)({
		css: "{{{css}}}",
		mainJs: "{{{mainJs}}}",
		pluginsJs: "{{{pluginsJs}}}",
		resume: resume,
		meta: {
			packageName: packageJSON.name,
			version: packageJSON.version
		}
	});

	const {css} = await less.render(lessFile, { paths: [__dirname + "/Kards10/less/"] });
	const optimizedCss = purify(firstRun, css);

	const unoptimizedHtml = Handlebars.compile(firstRun)({
		css: optimizedCss,
		mainJs: mainJs,
		pluginsJs: pluginsJs,
	});

	return htmlMinify(unoptimizedHtml, {
		collapseBooleanAttributes: true,
		collapseInlineTagWhitespace: true,
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
		minifyURLs: true,
		removeAttributeQuotes: true,
		removeComments: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		useShortDoctype: true
	});

	//const partialsDir = path.join(__dirname, 'partials');
	//const filenames = fs.readdirSync(partialsDir);
	//
	//filenames.forEach(function (filename) {
	//  const matches = /^([^.]+).hbs$/.exec(filename);
	//  if (!matches) {
	//    return;
	//  }
	//  const name = matches[1];
	//  const filepath = path.join(partialsDir, filename);
	//  const template = fs.readFileSync(filepath, 'utf8');
	//
	//  Handlebars.registerPartial(name, template);
	//});
}
module.exports = {
	render: render
};
