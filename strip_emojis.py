import re

files = ['index.html', 'script.js']

def remove_emoji(text):
    # Match emoji characters. This is a simple regex that matches typical emoji blocks.
    emoji_pattern = re.compile(
        r'['
        r'\U0001f600-\U0001f64f'  # emoticons
        r'\U0001f300-\U0001f5ff'  # symbols & pictographs
        r'\U0001f680-\U0001f6ff'  # transport & map symbols
        r'\U0001f1e0-\U0001f1ff'  # flags (iOS)
        r'\U00002702-\U000027b0'
        r'\U000024C2-\U0001F251'
        r'\U0001f900-\U0001f9ff'
        r'\U0001fa70-\U0001faff'
        r'\u2600-\u26ff'          # misc symbols
        r'\u2700-\u27bf'          # dingbats
        r'\u2328\ufe0f'           # keyboard
        r'\u2b50\ufe0f'           # star
        r'\u2728\ufe0f'           # sparkles
        r'\u2728'                 # sparkles
        r'\u2328'                 # keyboard
        r']+',
        re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    clean_content = remove_emoji(content)
    # clean up double spaces left behind
    clean_content = re.sub(r' +', ' ', clean_content)
    # clean up space before end tag
    clean_content = re.sub(r' <', '<', clean_content)
    # clean up space after start tag
    clean_content = re.sub(r'> ', '>', clean_content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(clean_content)

print("Done stripping emojis")
