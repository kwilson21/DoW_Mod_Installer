<p align="center"><img height="400px" width="400px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F66.media.tumblr.com%2Fe597aa6459a99147f6de88f646ce5d5f%2Ftumblr_pm1xgkwQUs1tdqkuno1_1280.png&f=1&nofb=1"></p>

# DoW Mod Installer

DoW Mod Installer is a desktop application designed to automate the process of installing mods mods for Dawn of War Soulstorm.

## About

I personally use this app to ease the set up process for the 7+ group of friends that I play with. Before using this app, the process of ensuring that all of my friends installed each mod one-by-one and in the exact order specified caused a lot of issues that took an extremly long time to troubleshoot. Because of this, I developed Dow Mod Installer to make the installation process as painless as possible.

## Usage

1. Download the latest version of Dow Mod Installer from the [releases page](https://github.com/kwilson21/DoW_Mod_Installer/releases)
2. Extract `DoW Mod Installer-2.0.1-win.zip` into a folder
3. Run `DoW Mod Installer.exe` as administrator
4. Make sure your DoW directory is correct, if not search for the correct directory
5. Download and search for each individual mod file
6. Click 'save' to backup your mod configurations
7. Click install to begin installing all of the mods

Mods will be installed in descending order.

## Advanced

### Editing mods.json

Users are free to modify the `mods.json` with their own mods, which they can then pass on to others. Users must have a `mods.json` file in the same directory as `DoW Mod Installer.exe` in order for the mods to load.

| Key                 | Type             | Description                                                                                                                                                                                                |
| :------------------ | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file_name`         | `string`         | The file name for the mod e.g. `example.zip`                                                                                                                                                               |
| `download_link`     | `string`         | A downlink link to the mod                                                                                                                                                                                 |
| `extract_locations` | `list of string` | A list of locations in the DoW Directory to extract to                                                                                                                                                     |
| `modifiers`         | `list of string` | A list of values to be passed directly to 7zip as a command line argument when extracting the mod see the [7zip command line documentation](https://sevenzip.osdn.jp/chm/cmdline/index.htm) for more info. |
| `shortcut`          | `string`         | A file name used to create a shortcut on the user's desktop                                                                                                                                                |

## Authors

- **Kazon Wilson**
