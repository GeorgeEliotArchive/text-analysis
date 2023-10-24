import csv
import re
import pandas as pd


def extract_words_from_file(filename="sample.txt", words_search=""):
    print(f"Extracting words from {filename}")
    # filtered_sentences = search_from_text_file(filename, words_search)
    filtered_sentences = search_from_csv_file(filename, words_search)
    # print("Found {} sentences:".format(len(filtered_sentences)))
    i = 0
    for sentence in filtered_sentences:
        print(" ", i, " - ", sentence.strip())
        i += 1
    return filtered_sentences


def search_from_text_file(filename, phrase):
    s = []
    with open(filename, "r") as file:
        text = file.read()

        # Split text into sentences
        sentences = re.split(r"(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s", text)
        max_sentence_length = 0
        for sentence in sentences:
            word_count = len(sentence.split())
            max_sentence_length = max(max_sentence_length, word_count)
            if phrase in sentence:
                s.append(sentence)

        print("Max sentence length: ", max_sentence_length)
    return s


def search_from_csv_file(filename, phrase):
    s = []
    max_sentence_length = 0
    df = pd.read_csv(filename)

    # Iterate through each row of the dataframe

    for index, row in df.iterrows():
        sentence = row["Sentence"]
        word_count = len(sentence.split())
        max_sentence_length = max(max_sentence_length, word_count)

        if phrase in sentence:
            s.append(sentence)

    print("Max sentence length: ", max_sentence_length)
    num_rows = df.shape[0]
    print("Number of rows:", num_rows)

    return s


if __name__ == "__main__":
    text_file = "../datasets/text_cleaned/Adam_bebe.txt"
    words_search = "his father"

    csv_file = "../datasets/text_sent_tokenized/Adam_bebe.csv"
    extract_words_from_file(csv_file, words_search)
