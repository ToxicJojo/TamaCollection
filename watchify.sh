#bin/sh
watchify app/js/UI/homeUI.js -o public/js/homeUI.js -v &
watchify app/js/UI/settingsUI.js -o public/js/settingsUI.js -v &
watchify app/js/UI/tamagotchisUI.js -o public/js/tamagotchisUI.js -v &
watchify app/js/UI/manageVersionsUI.js -o public/js/manageVersionsUI.js -v &
watchify app/js/UI/manageReleasesUI.js -o public/js/manageReleasesUI.js -v &
