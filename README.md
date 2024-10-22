[![Droopler](https://droopler-demo.droptica.com/themes/custom/droopler_subtheme/logo.svg 'Droopler')](https://droopler-demo.droptica.com)

# Droopler template for new project

---

## About

Droopler is a set of configurations (recipe) and a theme for Drupal 10, designed to kickstart a new website in just a few minutes. It is based on the latest frontend technologies, including Bootstrap 5. Droopler is maintained by Droptica.
* **Official website**: [droptica.com/droopler](https://www.droptica.com/droopler)
* **Tutorials**: [droptica.com/droopler/tutorials](https://www.droptica.com/droopler/tutorials/)
* **Demo**: [droopler-demo.droptica.com](https://droopler-demo.droptica.com)

For the latest news, follow us on [Facebook](https://www.facebook.com/Droopler/) and [Twitter](https://twitter.com/DrooplerCMS).

### What is this Droopler template? ##
It’s a skeleton, a boilerplate for new projects based on Droopler. If you want to use Droopler, clone (or download) this repository. It contains the minimal set of code required to start a new site. Treat it the same way as you would treat drupal/recommended-project or drupal-composer/drupal-project.

This repository includes:

- **composer.json** with all dependencies required to run Droopler.
- **.gitignore** adjusted to use GIT with Drupal.
- Boilerplate theme with the required CSS/SCSS and JavaScript files. It includes a webpack setup to speed up frontend development for Drupal.

[//]: # (TODO: Add information about the Droopler template for Platform.sh)
[//]: # (## Deploy on Platform.sh)

[//]: # ()
[//]: # (You can deploy and host your Droopler installation on [Platform.sh]&#40;https://platform.sh/&#41;.)

[//]: # ()
[//]: # (<a href="https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/droptica/droopler_project/4.0.x/.platform.template.yml">)

[//]: # (    <img src="https://platform.sh/images/deploy/lg-blue.svg" alt="Deploy Droopler on Platform.sh" width="180px" />)

[//]: # (</a>)

## Quick start

Fork this repository and clone the newly created to your local machine.

## Local development

This section provides instructions for running the `Droopler` distribution locally.

### Using DDEV

1. [Install ddev](https://ddev.readthedocs.io/en/stable/#installation).
2. Run `ddev config` to configure the project.
3. Run `ddev start` to start the project.
4. Run `ddev composer install` to download the project dependencies.
5. If you notice problems with accessing to the repository, run `ddev auth ssh` to add the keys from your `~/.ssh` directory to the web container and run `ddev composer install` command once again.
6. Run `ddev droopler-install` to install Droopler with the theme, all necessary configuration, and default content.

### Using Lando
1. [Install lando](https://docs.lando.dev/getting-started/installation.html).
2. Run `lando start` to start the project.
3. Run `lando prepare` to build the project's code. Alternatively, you can run `lando composer install` to download the project dependencies, and then `lando theme-production` to compile assets, and then `lando droopler-install` to install Droopler with the theme, all necessary configuration, and default content..
4. Go to the URL provided by `lando info` and finish installing the website.

### Using DDEV connected to a database instance on an active Platform.sh environment
This is instructions for running the template locally, connected to a live database instance on an active Platform.sh environment.

In all cases for developing with Platform.sh, it's important to develop on an isolated environment - do not connect to data on your production environment when developing locally.
Each of the options below assume that you have already deployed this template to Platform.sh, as well as the following starting commands:

```bash
platform get PROJECT_ID
cd project-name
platform environment:branch updates
```

DDEV provides an integration with Platform.sh that makes it simple to develop Drupal locally. Check the [providers documentation](https://ddev.readthedocs.io/en/latest/users/providers/platform/) for the most up-to-date information.

In general, the steps are as follows:

1. [Install ddev](https://ddev.readthedocs.io/en/stable/#installation).
1. A configuration file has already been provided at `.ddev/providers/platform.yaml`, so you should not need to run `ddev config`.
1. [Retrieve an API token](https://docs.platform.sh/development/cli/api-tokens.html#get-a-token) for your organization via the management console.
1. Update your ddev global configuration file to use the token you've just retrieved:
    ```yaml
    web_environment:
    - PLATFORMSH_CLI_TOKEN=abcdeyourtoken
    ```
1. Run `ddev restart`.
1. Get your project ID with `platform project:info`. If you have not already connected your local repo with the project (as is the case with a source integration, by default), you can run `platform project:list` to locate the project ID, and `platform project:set-remote PROJECT_ID` to configure Platform.sh locally.
1. Update the `.ddev/providers/platform.yaml` file for your current setup:
    ```yaml
    environment_variables:
    project_id: PROJECT_ID
    environment: CURRENT_ENVIRONMENT
    application: drupal
    ```
1. Get the current environment's data with `ddev pull platform`.
1. When you have finished with your work, run `ddev stop` and `ddev poweroff`.

> **Note:**
>
> For many of the steps above, you may need to include the CLI flags `-p PROJECT_ID` and `-e ENVIRONMENT_ID` if you are not in the project directory or if the environment is associated with an existing pull request.

## How to work with the subtheme?

### Using DDEV
There are several comands that help you to work with the subtheme. You can run them from the root directory of your project.

- `ddev theme watch` - watches for changes in SCSS and JS and processes them on the fly
- `ddev theme dev` - cleans derivative files and compiles all SCSS/JS in the theme for DEV environment
- `ddev theme production` - cleans derivative files and compiles all SCSS/JS in the subtheme for PROD environment

### Using lando
There are several comands that help you to work with the subtheme. You can run them from the root directory of your project.

- `lando theme-watch` - watches for changes in SCSS and JS and processes them on the fly
- `lando theme-dev` - cleans derivative files and compiles all SCSS/JS in the theme for DEV environment
- `lando theme-production` - cleans derivative files and compiles all SCSS/JS in the theme for PROD environment

### Running npm on your own
First run <strong>npm run watch</strong> in your theme's directory. It will track all the changes in theme source files and compile assets in the fly.

```sh
$ cd web/themes/custom/droopler_theme
$ npm run watch
```

There are also other npm commands for theme developers, here's the full reference:

- `npm run watch` - watches for changes in SCSS and JS and processes them on the fly
- `npm run dev` - cleans derivative files and compiles all SCSS/JS in the subtheme for DEV environment
- `npm run production` - cleans derivative files and compiles all SCSS/JS in the subtheme for PROD environment
- `npm run stylint` - run stylint
- `npm run stylint-fix` - run stylint and fix errors automatically

## SCSS structure

- **src/scss/main.style.scss** - combines all SCSS code from the theme
- **src/components** - directory where you can keep all your components, see [components/README.md](web/themes/custom/droopler_theme/src/components/README.md)

## SCSS Configuration

Droopler is designed to make your work easier. You don't have to override SCSS or CSS code to make your own adjustments. In most cases it is enough to modify the configuration.

Just look into variables definitions in the subtheme.

Use **src/scss/bootstrap/_variables.scss** file to overwrite base bootstrap variables.
```scss
// Colors.
// $red: #ac0000 !default;
// $orange: #ff9475 !default;
// $primary: $red !default;
```

Use **src/scss/base/_themes.scss** file to overwrite project specific colors in each theme.
```scss
// *[data-theme="theme-light"] {
//   --section-background-color: #fff;
//   --overlay-background-color: #fff;
//   --divider-background-color: #{$red};
//   ...
// }
```

Use **src/scss/base/_variables.scss** file to overwrite components/paragraphs variables.
```scss
// :root {
//   // Base component: CTA.
//   --cta-width: 100%;
//   --cta-max-width: 18rem;
//   --cta-margin-top-bottom: 0.25rem;
//   ...
// }
```

When you save this config file, **npm run dev** will recompile all SCSS with your own config.

> **Extending and overwriting components**
>
> Instead of overwriting the particular component through the CSS variables in the `_variables.scss` file, you can extend or overwrite it in the `src/components` directory.
>
> See: [components/README.md](web/themes/custom/droopler_subtheme/src/components/README.md)

## Updating Droopler

See the [UPDATE.md](https://github.com/droptica/droopler/blob/master/UPDATE.md) file from the Droopler profile.

## How to install Google Fonts?

By default Droopler uses free [Inter](https://fonts.google.com/specimen/Inter) webfont. If you wish to install your own fonts from Google - put their definitions into **droopler_subtheme.libraries.yml** like this:

```yaml
global-styling:
  version: VERSION
  css:
    theme:
      '//fonts.googleapis.com/css?family=Rajdhani:500,600,700|Roboto:400,700&subset=latin-ext': { type: external, minified: true }
      css/style.css: {}
```

## How to install icon fonts?

If you wish to install FontAwesome or Glyphicons from the CDN - just grab their URLs and follow the steps described in previous chapter about Google Fonts. You'll find a FontAwesome example in **droopler_subtheme.libraries.yml** and **droopler_subtheme.info.yml**.

## Setup git hooks
​
In the `.githooks` directory you can find the pre-commit hooks to run the quality tools and to make sure that the front-end has been compiled in the `production` mode.

To set-up git hooks run:
```shell
git config --local core.hooksPath .githooks/
```
​
For the first time or when you get no permission error add `+x` to those scripts.
```shell
chmod -R +x .githooks/
```
