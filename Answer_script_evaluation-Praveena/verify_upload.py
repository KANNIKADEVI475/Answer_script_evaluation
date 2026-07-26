import requests

files = {
    'student_file': ('student.txt', b'Artificial intelligence is the simulation of human intelligence in machines.', 'text/plain'),
    'answer_key_file': ('answer_key.txt', b'Artificial intelligence is the simulation of human intelligence in machines.', 'text/plain')
}

response = requests.post('http://127.0.0.1:8000/evaluate', files=files, timeout=10)
print(response.text)
