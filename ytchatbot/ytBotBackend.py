# ytbot_backend.py
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, ChatNVIDIA
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled


def extract_video_id(url: str) -> str:
    """Extract video ID if full URL is given."""
    if "youtube.com" in url or "youtu.be" in url:
        if "v=" in url:
            return url.split("v=")[-1].split("&")[0]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[-1].split("?")[0]
    return url.strip()


def fetch_transcript(video_id: str) -> str:
    """Fetch transcript text for a video."""
    snippets = YouTubeTranscriptApi().fetch(video_id, languages=['en'])
    return " ".join(snippet.text for snippet in snippets)


def build_vectorstore(text: str, embedding_api_key: str):
    """Create vectorstore from transcript."""
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.create_documents([text])
    embedding = NVIDIAEmbeddings(
        model="nvidia/llama-3.2-nemoretriever-300m-embed-v1",
        api_key="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",
        truncate="NONE",
    )
    return Chroma.from_documents(chunks, embedding)


def answer_question(vectorstore, user_question: str, llm_api_key: str) -> str:
    """Generate an answer using the transcript context."""
    results = vectorstore.similarity_search(user_question, k=5)
    context = "\n\n".join([doc.page_content for doc in results])

    youtube_prompt_template = PromptTemplate(
        input_variables=["context", "user_question"],
        template='''You are an assistant that answers questions about YouTube videos 
        based only on the transcript provided.  

        ===========================
        TRANSCRIPT:  
        {context}  

        QUESTION:  
        {user_question}  
        ===========================

        ### INSTRUCTIONS
        - Use only the information from the transcript.  
        - Do not add outside knowledge or assumptions.  
        - If the transcript doesn’t cover the question, say that clearly.  
        - Keep your tone neutral, clear, and easy to read.  

        ### RESPONSE FORMAT
        1. **Short Answer** – Start with a one-sentence summary that directly answers the question.  
        2. **Details** – Give a clear explanation or summary of relevant parts of the transcript.  
          - Organize by topic or timeline, whichever fits better.  
          - Use short paragraphs or bullet points for readability.  
        3. **Evidence** – Support your answer with key phrases or short quotes from the transcript.  
        4. **Gaps (if any)** – If something is missing from the transcript, point that out.  

        Keep answers concise, structured, and broadly useful across different video types.
        '''
    )

    llm = ChatNVIDIA(
        model="qwen/qwen3-next-80b-a3b-thinking",
        api_key="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",
        temperature=0.6,
        top_p=0.7,
        max_completion_tokens=4096,
    )

    final_prompt = youtube_prompt_template.format(
        context=context,
        user_question=user_question
    )
    answer = llm.invoke(final_prompt)
    return answer.content
