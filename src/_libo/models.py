# File Name: _libo/models.py
# Created: Oct 22, 2023

xml_folder = "src/datasets/fiction_cleaned_xml/"


def read_xml_file(filename):
    print(f"Reading XML file {filename}")
    try:
        with open(xml_folder + filename + ".xml", "r") as file:
            xml_data = file.read()
    except Exception as ex:
        print(" ! Error reading XML file: ", ex)
        xml_data = None
    return xml_data
