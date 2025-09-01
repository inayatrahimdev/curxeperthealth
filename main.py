import streamlit as st
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import speech_recognition as sr

# Download the VADER lexicon for sentiment analysis
nltk.download('vader_lexicon', quiet=True)

# Initialize the SentimentIntensityAnalyzer
sentiment_analyzer = SentimentIntensityAnalyzer()

# Function to analyze sentiment
def analyze_sentiment(text):
    sentiment = sentiment_analyzer.polarity_scores(text)
    if sentiment['compound'] >= 0.05:
        return "Positive", sentiment
    elif sentiment['compound'] <= -0.05:
        return "Negative", sentiment
    else:
        return "Neutral", sentiment

# Streamlit UI
st.title("🎤 Sentiment Analysis and Speech Recognition")
st.subheader("Analyze text sentiment and transcribe your voice seamlessly!")

# Sentiment Analysis Section
st.header("📝 Sentiment Analysis")
st.write("Analyze the sentiment of any text and get detailed sentiment scores.")
text_input = st.text_area("Enter text for sentiment analysis:")

if st.button("Analyze Sentiment"):
    if text_input:
        sentiment, sentiment_score = analyze_sentiment(text_input)
        st.write(f"Sentiment: {sentiment}")
        st.write("Detailed Sentiment Scores:")
        st.json(sentiment_score)
    else:
        st.error("Please enter some text for analysis.")

# Speech Recognition Section
st.header("🎙️ Speech Recognition")
st.write("Click 'Start' to begin speaking, then click 'Stop' to end and analyze your speech.")

# Initialize session state variables for recording
if "recording" not in st.session_state:
    st.session_state.recording = False

if st.button("Start Recording"):
    st.session_state.recording = True
    st.write("Recording... Please speak now.")

if st.session_state.recording and st.button("Stop Recording"):
    st.session_state.recording = False
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            st.info("Processing your speech...")
            audio = recognizer.listen(source)
            text = recognizer.recognize_google(audio)
            st.write(f"Transcribed Text: {text}")

            # Analyze sentiment of the transcribed text
            sentiment, sentiment_score = analyze_sentiment(text)
            st.write(f"Sentiment: {sentiment}")
            st.write("Detailed Sentiment Scores:")
            st.json(sentiment_score)

    except sr.UnknownValueError:
        st.error("Sorry, I could not understand the audio. Please try again.")
    except sr.RequestError as e:
        st.error(f"Could not request results from the speech recognition service; {e}")
    except Exception as e:
        st.error(f"An unexpected error occurred: {e}")
