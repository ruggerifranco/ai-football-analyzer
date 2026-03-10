import google.generativeai as genai

genai.configure(api_key="AIzaSyAFAStM3GPnv-wP-bMRXM5t40t0aGFkvpY")

for model in genai.list_models():
    print(model.name, model.supported_generation_methods)