# Remove ambiguous unicode characters from the plain text file

import unicodedata
import os


def identify_and_replace_ambiguous_characters(text):
    """
    identify and replace ambiguous characters in a string
    """
    total_replacements = 0
    for char in text:
        name = ""
        try:
            name = unicodedata.name(char)
        except ValueError:  # Some characters might not have a name
            pass

        category = unicodedata.category(char)

        # Add conditions for what you consider as ambiguous. Here's an example:
        if "Zs" in category:  # Space separator
            print(
                f"Found ambiguous character '{char}' with category '{category}', name '{name}', and ASCII value {ord(char)}"
            )

            # Replace the ambiguous character with a normal space
            text = text.replace(char, " ")
            total_replacements += 1

    print(f"Total replacements: {total_replacements}")

    return text


def locate_non_ascii_characters(text):
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


def replace_ambiguous_characters(text):
    replacement_map = {
        "”": '"',
        "“": '"',
        "‘": "'",
        "’": "'",
        "—": "-",
        "–": "-",
        "\xa0": " ",
        "…": "...",
        "Ä": "Ae",
        "ä": "ae",
        "æ": "ae",
        "Æ": "AE",
        "Â": "A",
        "â": "a",
        "Œ": "OE",
        "œ": "oe",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "à": "a",
        "¹": "1",
        "µ": "mu",
        "É": "E",
        "ç": "c",
        "³": "3",
        "ù": "u",
        "ï": "i",
        "ò": "o",
        "È": "E",
        "ü": "u",
        "î": "i",
        "û": "u",
        "ä": "a",
        "ó": "o",
        "ô": "o",
        "ö": "o",
        "ø": "o",
        "¸": "",
    }

    for original_char, replacement_char in replacement_map.items():
        text = text.replace(original_char, replacement_char)
    return text


def read_text_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def save_text_file(file_path, text):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(text)


source_dir = "text_plain"
cleaned_dir = "text_cleaned"


def main():
    for file_name in os.listdir(source_dir):
        if file_name.endswith(".txt"):  # Only process .txt files
            source_file_path = os.path.join(source_dir, file_name)
            cleaned_file_path = os.path.join(cleaned_dir, file_name)

            text_content = read_text_file(source_file_path)

            # Replace ambiguous characters
            new_text_content = replace_ambiguous_characters(text_content)

            # Write the modified content to the 'cleaned' folder
            save_text_file(cleaned_file_path, new_text_content)


if __name__ == "__main__":
    main()
