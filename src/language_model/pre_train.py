from transformers import AutoTokenizer, AutoModelForCausalLM

import time

start_time = time.time()

# Load pre-trained model and tokenizer
model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Provide a passage from the book as context
context = """Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'\n"""

# Ask a question related to the context
question = "Why was Alice feeling tired?"

# file_to_read = "../datasets/text_cleaned/Brother_Jacob.txt"
# f = open(file_to_read, "r")
# context = f.read() + "\n"
# f.close()
# question = "Could you summarize the story?"


input_text = context + question

# Encode input text and get the model's prediction
input_ids = tokenizer.encode(input_text, return_tensors="pt")
output = model.generate(input_ids, max_length=50000, num_return_sequences=1, no_repeat_ngram_size=2, pad_token_id=tokenizer.eos_token_id)

# Decode and display the answer
decoded_output = tokenizer.decode(output[0], skip_special_tokens=True)
answer = decoded_output[len(input_text) :]  # Extract only the answer part
print(answer)
end_time = time.time()
print(f"Tokenization took {end_time - start_time:.4f} seconds.")
total_seconds = int(end_time - start_time)
hours = total_seconds // 3600
minutes = (total_seconds % 3600) // 60
seconds = total_seconds % 60

print(f"Tokenization took {hours} hours, {minutes} minutes, and {seconds} seconds.")
