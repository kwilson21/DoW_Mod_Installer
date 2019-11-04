import json
import os
import wget
import sys
from string import ascii_uppercase

FILEPATH = os.path.dirname(os.path.realpath(__file__))

default_dow_directory = (
    "C:/Program Files (x86)/Steam/steamapps/common/Dawn of War Soulstorm"
)
default_7z_directory = "C:/Program Files/7-Zip/7z.exe"

dow_prompt = (
    "Please enter your Dawn of War Soulstorm folder path."
    f" i.e. '{default_dow_directory}': "
)

_7z_prompt = (
    "Please enter your 7zip installation directory." f"i.e. '{default_7z_directory}': "
)


def find(name, path):
    for root, _, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)
    return ""


def find_program(program):
    for c in ascii_uppercase:
        program_directory = find(program, f"{c}:\\")[: -(len(program) + 1)]
        if os.path.exists(program_directory):
            return True

    return False


def download_mods(mod_cfg):
    for mod in mod_cfg:
        if not os.path.exists(f'{FILEPATH}/{mod["file_name"]}'):
            print(f"Could not find file for {mod['file_name']}, now downloading")
            wget.download(mod["download_link"])


def extract_mods(mod_cfg, _7z_directory, dow_directory):
    for mod in mod_cfg:
        print(f"Installing {mod['file_name']}...")
        if ".exe" in mod["file_name"]:
            pass
        elif mod["file_name"] == "UA_THB_v1.88.72_FULL.zip":
            os.system(f"{_7z_directory} x UA_THB_v1.88.72_FULL.zip -aos")

            os.system(
                f'{_7z_directory} x UA_THB_v1.88.72_FULL.7z -aoa -o"{dow_directory}"'
            )

        elif (
            mod["file_name"] == "Red_I_Map_Compilation_Revision_III.rar"
            or mod["file_name"] == "Red_III_Map_Compilation_Revision_II.rar"
        ):
            for loc in mod["extract_locations"]:
                os.system(
                    f'{_7z_directory} x "{mod["file_name"]}" -aoa -o"{dow_directory}/{loc}" Data'
                )
        elif "extract_locations" in mod:
            for loc in mod["extract_locations"]:
                os.system(
                    f'{_7z_directory} x "{mod["file_name"]}" -aoa -o"{dow_directory}/{loc}"'
                )
        else:
            os.system(
                f'{_7z_directory} x "{mod["file_name"]}" -aoa -o"{dow_directory}"'
            )

    print(
        "Mods extracted. Be sure to install the Tyranids mod and run the 4GB patch before playing."
    )


def main():
    print("Loading mods.json...")
    try:
        mod_cfg = json.load(open("mods.json"))
    except FileNotFoundError:
        input("mods.json file missing, please replace the file in your directory!")
        sys.exit(1)
    print("Mods.json loaded")

    print("Searching for DoW directory...")

    if os.path.exists(default_dow_directory):
        dow_directory = default_dow_directory
    elif _dir := find_program("Soulstorm.exe"):
        dow_directory = _dir
    else:
        while not os.path.exists(dow_directory := input(dow_prompt)):
            print("Unable to find DoW directory")

    print("DoW directory found")

    print("Searching for 7zip directory...")

    if os.path.exists(default_7z_directory):
        _7z_directory = default_7z_directory
    elif _dir := find_program("7z.exe"):
        _7z_directory = _dir
    else:
        while not os.path.exists(_7z_directory := input(_7z_prompt)):
            print("Unable to find 7zip directory")

    if "Program Files" in _7z_directory:
        _7z_directory = str.replace(_7z_directory, "Program Files", '"Program Files"')
    elif "Program Files (x86)" in _7z_directory:
        _7z_directory.replace("Program Files (x86)", '"Program Files (x86)"')

    print("7zip directory found")

    download_mods(mod_cfg)
    extract_mods(mod_cfg, _7z_directory, dow_directory)


if __name__ == "__main__":
    main()
    input("")
