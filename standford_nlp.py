import stanfordnlp

# Download models for English
stanfordnlp.download('en')

# Create a pipeline for English
nlp = stanfordnlp.Pipeline()

# Process a sample sentence
doc = nlp("Stanford University is located in California.")
print(doc.sentences[0].print_dependencies())