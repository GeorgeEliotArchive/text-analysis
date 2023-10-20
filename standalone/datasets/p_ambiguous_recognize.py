# Remove ambiguous unicode characters from the plain text file


import unicodedata
import os


def locate_non_ascii_characters(text, ambchars):
    """locates non-ASCII characters in a string and prints their details
    a list of ambiguous characters is returned
    """

    non_ascii_chars = set()  # Using a set to ensure unique values
    for char in text:
        if ord(char) > 127:
            non_ascii_chars.add(char)

    # Print the details of the non-ASCII characters
    for char in non_ascii_chars:
        name = ""
        try:
            name = unicodedata.name(char)
        except ValueError:  # Some characters might not have a name
            pass
        category = unicodedata.category(char)
        print(
            f"Found non-ASCII character '{char}' with category '{category}', name '{name}', and ASCII value {ord(char)}"
        )
        if char not in ambchars:
            ambchars.append(char)
    return ambchars


def read_text_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def save_text_file(file_path, text):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(text)


source_dir = "text_plain"
cleaned_dir = "text_cleaned"


def main():
    ambchars = []
    for file_name in os.listdir(source_dir):
        if file_name.endswith(".txt"):  # Only process .txt files
            print(f" - Processing file {file_name} ...")
            source_file_path = os.path.join(source_dir, file_name)
            locate_non_ascii_characters(read_text_file(source_file_path), ambchars)

    print(f"Ambiguous characters: {ambchars}")


if __name__ == "__main__":
    main()
