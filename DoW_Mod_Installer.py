import json
import os
import wget
import sys
from string import ascii_uppercase

FILEPATH = os.path.dirname(os.path.realpath(__file__))


def find(name, path):
    for root, _, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)
    return ''


try:
    mod_info = json.load(open('mods.json'))
except FileNotFoundError:
    input("mods.json file missing, please replace the file in your directory!")
    sys.exit(1)

DoW_Directory_found = False

print("Searching for DoW directory...")

for c in ascii_uppercase:
    DoW_Directory = find("Soulstorm.exe", f"{c}:\\")[:-14]
    DoW_Directory_found = os.path.exists(DoW_Directory)
    if DoW_Directory_found:
        break

if not DoW_Directory_found:
    print("Unable to find DoW directory")

while not DoW_Directory_found:
    DoW_Directory = input(
        "Please enter your Dawn of War Soulstorm folder path. i.e. 'C:/Program Files (x86)/Steam/steamapps/common/Dawn of War Soulstorm': ")

    if DoW_Directory == "":
        DoW_Directory = "C:/Program Files (x86)/Steam/steamapps/common/Dawn of War Soulstorm"

    DoW_Directory_found = os.path.exists(DoW_Directory)

    if not DoW_Directory_found:
        print("Directory specified does not exist")

loc_7z_found = False

print("Searching for 7z directory...")

for c in ascii_uppercase:
    loc_7z = find("7z.exe", f"{c}:\\")
    loc_7z_found = os.path.exists(loc_7z)
    if loc_7z_found:
        break

if not loc_7z_found:
    print("Unable to find DoW directory")

while not loc_7z_found:
    loc_7z = input(
        "Please enter your 7zip installation directory. i.e. 'C:/Program Files/7-Zip/7z.exe': ")

    if loc_7z == "":
        loc_7z = "C:/Program Files/7-Zip/7z.exe"

    loc_7z_found = os.path.exists(loc_7z)

    if not loc_7z_found:
        print("Directory specified does not exist")

if "Program Files" in loc_7z:
    loc_7z = str.replace(loc_7z, 'Program Files', '"Program Files"')
elif "Program Files (x86)" in loc_7z:
    loc_7z.replace("Program Files (x86)", '"Program Files (x86)"')


def download_mods():
    for mod in mod_info:
        if not os.path.exists(f'{FILEPATH}/{mod["file_name"]}'):
            print(f"Downloading the following mod: {mod['file_name']}")
            wget.download(mod['download_link'])


def extract_mods():
    for mod in mod_info:
        print(f"Installing {mod['file_name']}...")
        if ".exe" in mod['file_name']:
            pass
        elif mod['file_name'] == "UA_THB_v1.88.71_FULL.zip":
            os.system(
                f'{loc_7z} x UA_THB_v1.88.71_FULL.zip -aos')

            os.system(
                f'{loc_7z} x UA_THB_v1.88.71_FULL.7z -aoa -o"{DoW_Directory}"')

        elif mod['file_name'] == "Red_I_Map_Compilation_Revision_III.rar" or mod['file_name'] == "Red_III_Map_Compilation_Revision_II.rar":
            for loc in mod["extract_locations"]:
                os.system(
                    f'{loc_7z} x "{mod["file_name"]}" -aoa -o"{DoW_Directory}/{loc}" Data')
        elif "extract_locations" in mod:
            for loc in mod["extract_locations"]:
                os.system(
                    f'{loc_7z} x "{mod["file_name"]}" -aoa -o"{DoW_Directory}/{loc}"')
        else:
            os.system(
                f'{loc_7z} x "{mod["file_name"]}" -aoa -o"{DoW_Directory}"')
            # if mod['file_name'] == "1.22.7z":
            #     os.system(
            #         f'{loc_7z} x UA_THB_v1.88.71_FULL.7z -aos -o"{DoW_Directory}/UltimateApocalypse_Salcol" "UltimateApocalypse_THB/data" -r')

    print("Mods extracted. Make sure to install the Tyranids mod and do the 4GB patch before playing.")


if __name__ == "__main__":
    download_mods()
    extract_mods()
    input("")
