import csv
import os
import nltk
from nltk.tokenize import sent_tokenize

import spacy

# Download the Punkt tokenizer models (only need to do this once)
nltk.download("punkt")


# Read the text file
def read_text_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


# Write sentences to CSV
def write_sentences_to_csv(filename, sentences):
    with open(filename, "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Sentence"])  # Writing the header
        for sentence in sentences:
            cleaned_sentence = sentence.strip()
            if cleaned_sentence:  # Skip empty sentences
                writer.writerow([cleaned_sentence])


def save_to_csv(file_path, content):
    write_sentences_to_csv(file_path, content)


cleaned_dir = "text_cleaned"
sent_tokenize_dir = "text_sent_tokenized"


def sentence_tokenize_by_nltk():
    for file_name in os.listdir(cleaned_dir):
        if file_name.endswith(".txt"):  # Only process .txt files
            source_file_path = os.path.join(cleaned_dir, file_name)
            sent_file_path = os.path.join(sent_tokenize_dir, file_name.split(".")[0] + ".csv")

            # Read the text file and tokenize it
            text = read_text_file(source_file_path)
            sentences = sent_tokenize(text)

            # save the tokenized sentences to a CSV file
            write_sentences_to_csv(sent_file_path, sentences)


def sentence_tokenize_by_spacy():
    #   !pip install spacy
    # !python -m spacy download en_core_web_sm  # Download the English model

    for file_name in os.listdir(cleaned_dir):
        if file_name.endswith(".txt"):  # Only process .txt files
            source_file_path = os.path.join(cleaned_dir, file_name)
            sent_file_path = os.path.join(sent_tokenize_dir, file_name.split(".")[0] + "_spacy.csv")

            # Read the text file and tokenize it
            text = read_text_file(source_file_path)
            nlp = spacy.load("en_core_web_sm")
            nlp.max_length = 2000000
            doc = nlp(text)

            # save the tokenized sentences to a CSV file
            # Write sentences to CSV
            with open(sent_file_path, "w", encoding="utf-8", newline="") as file:
                writer = csv.writer(file)
                writer.writerow(["Sentence"])  # Writing the header
                for sentence in doc.sents:
                    cleaned_sentence = sentence.text.strip()
                    if cleaned_sentence:  # Skip empty sentences
                        writer.writerow([cleaned_sentence])


def main():
    # sentence_tokenize_by_nltk()
    sentence_tokenize_by_spacy()


if __name__ == "__main__":
    main()
