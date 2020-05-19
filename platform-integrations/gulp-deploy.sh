# reset path
cd ~/

# prepare NPM dir
chmod 744 .npm

# prepare and compile droopler_theme 
chmod 744 web/profiles/contrib/droopler/themes/custom/droopler_theme/node_modules
chmod 744 web/profiles/contrib/droopler/themes/custom/droopler_theme/js
chmod 744 web/profiles/contrib/droopler/themes/custom/droopler_theme/css
cd ~/web/profiles/contrib/droopler/themes/custom/droopler_theme
npm install
npm rebuild node-sass
gulp compile

# reset path
cd ~/

# prepare and compile droopler_subtheme 
chmod 744 web/themes/custom/droopler_subtheme/node_modules
chmod 744 web/themes/custom/droopler_subtheme/js
chmod 744 web/themes/custom/droopler_subtheme/css
cd ~/web/themes/custom/droopler_subtheme
npm install
npm rebuild node-sass
gulp compile

# reset path
cd ~/