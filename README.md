# DoW Mod Installer

A python script created to automate the installation of mods for Dawn of War Soulstorm.

## Getting Started

This script is designed for the laziest/least computer savy, all the script requires you to have is Dawn of War Soulstorm and 7zip installed. Installing Python is optional as the release version of this script is compiled into an .exe using pyinstaller. When running the script, it will search for your soulstorm and 7zip directories, if it cannot find the directories, you will have the option to manually input the directories. Upon completion of all the extractions, you must manually install the tyranids mod and apply the 4gb patch to your soulstorm.exe and graphicsconfig.exe.

## Configuring the script

To add/remove mods to the script, simply edit the mods.json file. I suggest logging into gofile.com and re-uploading your mods there as the auto download function will only work with direct download links. The mods.json file supplies the following keys: filename, download_link and extraction_locations. Fill in the fields as needed and you should be good to go, if your script requires more complex extractions, you will need to modify the extract_mods function in the script.

## Authors

- **Kazon Wilson**
