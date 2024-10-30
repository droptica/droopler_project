// #ddev-generated
let docroot = process.env.DDEV_DOCROOT;
let filesdir = process.env.DDEV_FILES_DIR;
let url = process.env.DDEV_HOSTNAME;

if (filesdir === "") {
    filesdir = null
}

module.exports = {

    files: [docroot, "app", "resources/views/**/*.php"],
    ignore: ["node_modules", filesdir, "vendor"],
    open: false,
    ui: false,
    server: false,
    proxy: {
        target: "drooplerfresh.ddev.site"
    },
    host: url,
}
